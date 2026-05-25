
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { AppRouter } from './providers/router';


import '@/shares/style/global.scss'
import { theme } from '@/shares/constants/theme';

function App() {
  return (
    <ConfigProvider locale={ruRU} theme={theme}>
       <AppRouter />
    </ConfigProvider>
  );
}

export default App;
