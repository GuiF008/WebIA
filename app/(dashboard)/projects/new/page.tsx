import OnboardingSteps from '@/components/onboarding/OnboardingSteps';

export const metadata = {
  title: 'Créer un site — OVH Website Builder',
  description: 'Décrivez votre activité et laissez l\'IA créer votre site web.',
};

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Créez votre site web en quelques minutes
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Décrivez votre activité, choisissez un style, et notre IA génère un
          site professionnel prêt à publier.
        </p>
      </div>
      <OnboardingSteps />
    </div>
  );
}
