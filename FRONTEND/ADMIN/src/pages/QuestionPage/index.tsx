import { inquiryStore } from '@/entities/question/modal/store';
import { QuestionTable } from '@/entities/question/ui/QuestionTable';
import { QuestionManager } from '@/widgets/question-manager';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';


export const QuestionPage = observer(() => {

  useEffect(() => {
      inquiryStore.fetchInquiries()
    }, []);

  return (
    <>
      <QuestionManager />

      <QuestionTable data={inquiryStore.inquiries} loading={inquiryStore.isLoading}/>
    </>
  );
});
