export default function SeqBox({ data }) {
  if (!data) return null;
  return (
    <div className="seq-box">
      <span className="seq-box-title">{data.title}</span>
      <p>{data.description()}</p>
    </div>
  );
}
