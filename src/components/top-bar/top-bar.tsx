import './top-bar.scss';
import { useTranslation } from 'react-i18next';

const TopBar = () => {
  const { t } = useTranslation('translation');
  return (
    <div className='top-bar'>
      <div>
        <button className='top-bar-login'>{t('TOP_BAR.LOGIN_BUTTON')}</button>
        <button>{t('TOP_BAR.SIGN_UP_BUTTON')}</button>
      </div>
    </div>
  );
};

export default TopBar;
