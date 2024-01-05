const SoftButton = ({ children }) => {
  return (
    <button className="px-6 py-2 font-medium bg-amber-600 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-lg">
      {children}
    </button>
  );
};

export default SoftButton;
