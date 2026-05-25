import { Input, Select, Card, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { SearchFieldType } from '@/entities/application/modal/store';

interface ApplicationFiltersProps {
  searchField: SearchFieldType;
  onSearch: (value: string) => void;
  onSearchFieldChange: (field: SearchFieldType) => void;
  onStatusChange: (status: string | null) => void;
}

const searchFieldOptions = [
      { value: 'name', label: 'ФИО' },
      { value: 'phone', label: 'Телефон' },
      { value: 'vin', label: 'VIN' },
      { value: 'plate', label: 'Госномер' },

]

const statusOptions = [
  { value: 'WAITING', label: 'Ожидание' },
  { value: 'ACCEPTED', label: 'В работе' },
  { value: 'READY', label: 'Готово' },
];


export const ApplicationFilters = ({
  searchField,
  onSearch,
  onSearchFieldChange,
  onStatusChange
}: ApplicationFiltersProps) => {



  return (
    <Card style={{ marginBottom: 20 }}>
       <Flex gap={20}>
         <Select
          value={searchField}
          onChange={onSearchFieldChange}
          options={searchFieldOptions}
          allowClear
          showSearch
          size="large"
          style={{
            flex: '0 0 200px',
          }}
        />

        <Input
          placeholder="Введите данные для поиска..."
          allowClear
          onChange={(e) => onSearch(e.target.value)}
          size="large"
          prefix={<SearchOutlined />}
        />

        <Select
          placeholder="Фильтр по статусу"
          allowClear
          size="large"
          onChange={(val) => onStatusChange(val || null)}
          options={statusOptions}
          style={{
            flex: '0 0 150px',
          }}
        />
       </Flex>

    </Card>
  );
};
