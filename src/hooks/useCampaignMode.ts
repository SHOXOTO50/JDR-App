import { useAppSelector } from '../store';
import { DRAGON_BALL_CAMPAIGN_ID } from '../data/dragonBallCampaign';

export type CampaignMode = 'fantasy' | 'dragonball' | 'custom';

export const useCampaignMode = (): { mode: CampaignMode; isDB: boolean } => {
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === activeCampaignId)
  );

  const isDB =
    activeCampaignId === DRAGON_BALL_CAMPAIGN_ID ||
    (activeCampaign?.system?.startsWith('Dragon Ball') ?? false);

  const mode: CampaignMode = isDB
    ? 'dragonball'
    : activeCampaign?.system === 'Personnalisé'
    ? 'custom'
    : 'fantasy';

  return { mode, isDB };
};
