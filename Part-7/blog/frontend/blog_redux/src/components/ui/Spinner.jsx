const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]">
      <div className="relative h-22 w-22">
        <div className="absolute inset-0 animate-spin rounded-full border-[6px] border-cyan-400 border-t-transparent shadow-[0_0_25px_#22d3eecc]"></div>
        <div className="absolute inset-4 rounded-full bg-[#0b1120]"></div>
      </div>
    </div>
  );
};

export default Spinner;
