import { observer } from 'mobx-react-lite';
import { applicationStore } from '@/entities/application/modal/store';
import { ApplicationTable } from '@/entities/application/ui/ApplicationTable';
import { ApplicationFilters } from '@/features/application-filters';
import { useEffect } from 'react';



import { ApplicationHeader } from '@/widgets/application-manager';
import { CreateApplicationModal } from '@/features/create-application/ui/CreateApplicationModal';
import { ApplicationViewModal } from '@/features/application-view/ui';


export const ApplicationManager = observer(() => {

  useEffect(() => {
    applicationStore.fetchApplications();
  }, []);


  return (
    <>

      <CreateApplicationModal />
      <ApplicationViewModal />

      <ApplicationHeader />


      <ApplicationFilters
       searchField={applicationStore.searchField}
        onSearch={(val) => applicationStore.setSearchQuery(val)}
        onSearchFieldChange={(val) => applicationStore.setSearchField(val)}
        onStatusChange={(val) => applicationStore.setStatusFilter(val)}
      />

      <ApplicationTable
        data={applicationStore.filteredApplications}
        loading={applicationStore.isLoading}
        onEdit={(rec) => console.log(rec)}
      />
    </>
  );
});
