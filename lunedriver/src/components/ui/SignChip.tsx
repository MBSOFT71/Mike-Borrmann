type SignChipProps = {
  label: string
}

export function SignChip({ label }: SignChipProps) {
  return <span className="sign-chip">{label}</span>
}
