interface Props {
  message: string | null | undefined;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;
  return <p className="text-[12px] text-[#DC2626]">{message}</p>;
};

export default FormError;
