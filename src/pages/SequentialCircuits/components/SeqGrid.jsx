export default function SeqGrid({ data }) {
  return (
    <>
      <div className="seq-grid-2">
        {data.map((index, idx) => {
          return (
            <div key={idx} className="seq-feature-card">
              <span className="seq-feature-icon">{index.icon}</span>
              <div className="seq-feature-card-content">
                <p className="seq-feature-title">{index.title}</p>
                <p className="seq-feature-desc">{index.line}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
