type Nullable<T> = T | null | undefined;

interface User {
  fullname: Nullable<string>;
  email: Nullable<string>;
  emailVerified: Nullable<boolean>;
}

interface Auth {
  isAuthorized: boolean;
  user: Nullable<User>;
}

export default async function useAuth() {
  const auth = useState<Nullable<Auth>>('auth')
  function setAuth(value: Nullable<Auth>) {
    auth.value = value
  }
  return {auth, setAuth};
}