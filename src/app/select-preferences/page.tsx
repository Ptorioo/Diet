import PreferenceSelector from '@/components/preferences/PreferenceSelector';

export const metadata = {
  title: 'Select Your Craving - Diet',
  description: 'Tell us what type of food you are looking for.',
};

export default function SelectPreferencesPage() {
  return (
    <PreferenceSelector />
  );
}
