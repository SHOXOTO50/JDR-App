import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import { addNote, updateNote, deleteNote } from '../store/slices/notesSlice';
import { Note, NoteType } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, formatDate, getNoteTypeLabel, truncate } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

const NOTE_TYPES: { key: NoteType | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Toutes', icon: '📚' },
  { key: 'libre', label: 'Libre', icon: '📝' },
  { key: 'session', label: 'Session', icon: '🎮' },
  { key: 'personnage', label: 'Perso', icon: '👤' },
  { key: 'campagne', label: 'Campagne', icon: '🗺️' },
];

const NOTE_TYPE_COLORS: Record<NoteType, string> = {
  libre: colors.textSecondary,
  session: colors.secondary,
  personnage: colors.primary,
  campagne: colors.warning,
};

const defaultNote = (characterId: string): Note => ({
  id: generateId(),
  characterId,
  title: '',
  content: '',
  type: 'libre',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const NoteCard = ({ note, onPress }: { note: Note; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.noteCard} activeOpacity={0.8}>
    <View style={[styles.noteAccent, { backgroundColor: NOTE_TYPE_COLORS[note.type] }]} />
    <View style={styles.noteContent}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>{note.title || 'Sans titre'}</Text>
        <Text style={styles.noteDate}>{formatDate(note.updatedAt)}</Text>
      </View>
      <Text style={styles.notePreview} numberOfLines={2}>
        {note.content || 'Note vide...'}
      </Text>
      <View style={styles.noteFooter}>
        <Badge
          label={getNoteTypeLabel(note.type)}
          color={NOTE_TYPE_COLORS[note.type]}
          size="sm"
        />
        {note.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {note.tags.slice(0, 3).map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const NoteEditor = ({
  note,
  onChange,
  onDelete,
  isNew,
}: {
  note: Note;
  onChange: (n: Note) => void;
  onDelete: () => void;
  isNew: boolean;
}) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, '');
    if (tag && !note.tags.includes(tag)) {
      onChange({ ...note, tags: [...note.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    onChange({ ...note, tags: note.tags.filter((t) => t !== tag) });
  };

  return (
    <>
      <Input label="Titre" value={note.title} onChangeText={(v) => onChange({ ...note, title: v })} placeholder="Titre de la note..." />
      <Text style={styles.fieldLabel}>Type</Text>
      <View style={styles.typeRow}>
        {NOTE_TYPES.filter((t) => t.key !== 'all').map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => onChange({ ...note, type: t.key as NoteType })}
            style={[styles.typeChip, note.type === t.key && { borderColor: NOTE_TYPE_COLORS[t.key as NoteType], backgroundColor: NOTE_TYPE_COLORS[t.key as NoteType] + '22' }]}
          >
            <Text style={styles.typeChipText}>{t.icon} {t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input
        label="Contenu"
        value={note.content}
        onChangeText={(v) => onChange({ ...note, content: v })}
        placeholder="Écrivez votre note ici..."
        multiline
        numberOfLines={8}
      />
      <Text style={styles.fieldLabel}>Tags</Text>
      <View style={styles.tagInputRow}>
        <TextInput
          style={styles.tagInput}
          value={tagInput}
          onChangeText={setTagInput}
          placeholder="Ajouter un tag..."
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={addTag}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addTag} style={styles.addTagBtn}>
          <Text style={styles.addTagText}>+</Text>
        </TouchableOpacity>
      </View>
      {note.tags.length > 0 && (
        <View style={styles.tagsDisplay}>
          {note.tags.map((tag) => (
            <TouchableOpacity key={tag} onPress={() => removeTag(tag)} style={styles.tagItem}>
              <Text style={styles.tagItemText}>#{tag} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!isNew && (
        <Button label="Supprimer la note" variant="danger" onPress={onDelete} style={{ marginTop: spacing.sm }} fullWidth />
      )}
    </>
  );
};

export const JournalScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector((s) => s.characters.currentCharacterId) ?? '';
  const allNotes = useAppSelector((s) => s.notes.notes);
  const notes = allNotes.filter((n) => n.characterId === currentId);

  const [filter, setFilter] = useState<NoteType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    let list = [...notes];
    if (filter !== 'all') list = list.filter((n) => n.type === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, filter, search]);

  const openCreate = () => {
    setEditingNote(defaultNote(currentId));
    setModalVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote({ ...note });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editingNote) return;
    if (!editingNote.title.trim() && !editingNote.content.trim()) {
      Alert.alert('Note vide', 'Ajoutez un titre ou un contenu.');
      return;
    }
    const now = new Date().toISOString();
    if (notes.find((n) => n.id === editingNote.id)) {
      dispatch(updateNote({ ...editingNote, updatedAt: now }));
    } else {
      dispatch(addNote({ ...editingNote, createdAt: now, updatedAt: now }));
    }
    setModalVisible(false);
    setEditingNote(null);
  };

  const handleDelete = () => {
    if (!editingNote) return;
    Alert.alert('Supprimer', 'Supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteNote(editingNote.id));
          setModalVisible(false);
          setEditingNote(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher dans les notes..."
          placeholderTextColor={colors.textMuted}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: colors.textMuted, padding: 4 }}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter tabs */}
      <FlatList
        data={NOTE_TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: t }) => (
          <TouchableOpacity
            onPress={() => setFilter(t.key)}
            style={[styles.filterTab, filter === t.key && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, filter === t.key && styles.filterTabTextActive]}>
              {t.icon} {t.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.countLabel}>{filtered.length} note{filtered.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <NoteCard note={item} onPress={() => openEdit(item)} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="📖"
            title="Aucune note"
            subtitle="Créez votre premier journal de campagne"
            actionLabel="Créer une note"
            onAction={openCreate}
          />
        }
      />

      <FAB onPress={openCreate} icon="+" />

      <Modal
        visible={modalVisible}
        onClose={handleSave}
        title={editingNote && notes.find((n) => n.id === editingNote.id) ? 'Modifier la note' : 'Nouvelle note'}
      >
        {editingNote && (
          <>
            <NoteEditor
              note={editingNote}
              onChange={setEditingNote}
              onDelete={handleDelete}
              isNew={!notes.find((n) => n.id === editingNote.id)}
            />
            <Button label="Enregistrer" onPress={handleSave} fullWidth style={{ marginTop: spacing.sm }} />
          </>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: spacing.md, marginBottom: spacing.sm,
    backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10, fontSize: 14 },
  filterList: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: 8 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  filterTabActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  filterTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  filterTabTextActive: { color: colors.primary },
  countLabel: { ...typography.bodySmall, color: colors.textMuted, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.small,
  },
  noteAccent: { width: 4 },
  noteContent: { flex: 1, padding: spacing.sm },
  noteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  noteTitle: { ...typography.h5, color: colors.text, flex: 1, marginRight: 8 },
  noteDate: { ...typography.caption, color: colors.textMuted },
  notePreview: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 8, lineHeight: 18 },
  noteFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  tagsRow: { flexDirection: 'row', gap: 6 },
  tag: { ...typography.caption, color: colors.textMuted },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  typeChipText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  tagInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tagInput: {
    flex: 1, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10,
    color: colors.text, fontSize: 14,
  },
  addTagBtn: {
    width: 40, height: 40, borderRadius: borderRadius.round,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  addTagText: { color: colors.background, fontSize: 22, fontWeight: '700' },
  tagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  tagItem: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.round,
    backgroundColor: colors.secondary + '22', borderWidth: 1, borderColor: colors.secondary,
  },
  tagItemText: { ...typography.bodySmall, color: colors.secondary, fontWeight: '600' },
});
