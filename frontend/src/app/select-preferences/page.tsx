import SelectPreferencesClient from '@/components/preferences/SelectPreferencesClient';

export const dynamic = 'force-dynamic';

interface SelectPreferencesProps {
  searchParams: Promise<{
    preference?: string;
  }>;
}

export default async function SelectPreferencesPage({ searchParams }: SelectPreferencesProps) {
  try {
    const resolvedsearchParams = await searchParams;
    return <SelectPreferencesClient searchParams={resolvedsearchParams} />;
  } catch (error) {
    console.error('Failed to resolve search params:', error);
    return <div>Error loading preferences</div>;
  }
}