import lang from 'i18n-js';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const showDeleteContactActionSheet = ({
  address,
  nickname,
  onDelete,
  removeContact,
}) =>
  showActionSheetWithOptions(
    {
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      message: `Are you sure you want to delete "${nickname ||
        address}" from your contacts?`,
      options: [
        lang.t('contacts.options.delete'),
        lang.t('contacts.options.cancel'),
      ],
    },
    async buttonIndex => {
      if (buttonIndex === 0) {
        removeContact(address);
        ReactNativeHapticFeedback.trigger('notificationSuccess');
        onDelete();
      }
    }
  );

export default showDeleteContactActionSheet;
