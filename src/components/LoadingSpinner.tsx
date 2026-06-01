type LoadingSpinnerProps = {
  message: string;
};

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4 h-24 w-24">
        <div className="absolute inset-0 rounded-full border-4 border-pink-300/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-pink-400" />
        <div className="absolute inset-0 flex animate-pulse items-center justify-center text-3xl">
          🌸
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-200">{message}</p>
      <p className="mt-2 text-sm text-gray-400">魔法の処理には少し時間がかかります…</p>
    </div>
  );
}
