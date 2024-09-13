interface Props {
  errors?: {
    email?: string
  }
  values?: {
    email: string
  }
  redirectTo?: string | undefined
}
export function AuthForm({ values, errors, redirectTo }: Props) {
  const search = redirectTo
    ? `?redirectTo=${encodeURIComponent(redirectTo)}`
    : ""
  return (
    <form class="column gap-m" method="post" action={`/authenticate${search}`}>
      <div class="form-field">
        <label for="email-control">Email</label>
        <input
          id="email-control"
          type="email"
          name="email"
          value={values?.email ?? ""}
          placeholder="john.doe@example.com"
          required
        />
        {errors?.email && <small class="form-error">{errors.email}</small>}
      </div>
      <button type="submit">Sign In</button>
    </form>
  )
}
