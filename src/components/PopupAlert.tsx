import { enqueueSnackbar, VariantType } from 'notistack';

export default function PopupAlert(text: string, variant: VariantType) {
	enqueueSnackbar(text, {
		variant,
	});
}