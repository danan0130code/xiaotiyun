export default function Placeholder({ name }) {
  return (
    <div className="xty-placeholder">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <div>{name}</div>
      </div>
    </div>
  )
}
