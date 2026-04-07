import type { DomainSetupInstructions } from '@/types/ovh';

/**
 * V1 : instructions manuelles de configuration DNS.
 * V1+ : automatisation via l'API OVH Domains.
 */
export function getDomainSetupInstructions(
  customDomain: string,
  cdnUrl: string
): DomainSetupInstructions {
  const target = cdnUrl.replace('https://', '');

  return {
    cnameRecord: { name: customDomain, target },
    instructions: [
      '1. Accédez à votre gestionnaire DNS (OVHcloud ou autre registrar)',
      '2. Ajoutez un enregistrement CNAME :',
      `   Nom : ${customDomain}`,
      `   Cible : ${target}`,
      '3. La propagation DNS peut prendre 24-48h',
      '4. Le certificat TLS sera provisionné automatiquement une fois le DNS propagé',
    ],
  };
}
