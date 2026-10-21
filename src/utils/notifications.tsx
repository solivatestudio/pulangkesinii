import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type NoticeType = 'success' | 'error';

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4_000,
  timerProgressBar: true,
  didOpen: (popup) => {
    popup.addEventListener('mouseenter', Swal.stopTimer);
    popup.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: { popup: 'swal-pulangkesinii-toast' },
});

export const notify = (message: string, type: NoticeType = 'success') => {
  void toast.fire({ icon: type, title: message });
};

export const confirmAction = async (message: string, title = 'Yakin ingin melanjutkan?') => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: 'Ya, lanjutkan',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      confirmButton: 'swal-pulangkesinii-confirm',
      cancelButton: 'swal-pulangkesinii-cancel',
    },
  });
  return result.isConfirmed;
};
