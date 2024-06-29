export default defineNuxtRouteMiddleware(async () => {
  const { auth, setAuth } = await useAuth();
  if (auth.value) return;
  try {
    const response = await $fetch('/api/user');
    setAuth({ isAuthorized: true, user: response })
  } catch {
    setAuth({ isAuthorized: false, user: null })
   }
})
