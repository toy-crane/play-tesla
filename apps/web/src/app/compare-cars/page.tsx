import ShareButton from "./_components/share-button";

function Page() {
  return (
    <div className="content-grid">
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-semibold md:text-6xl flex flex-col gap-1 md:gap-2">
          <span className="inline-flex">Tesla</span>
          <span className="inline-flex">모델 비교하기</span>
        </h1>
        <ShareButton />
      </div>
    </div>
  );
}

export default Page;
