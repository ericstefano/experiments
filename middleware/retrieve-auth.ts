export default defineNuxtRouteMiddleware(async () => {
  const { auth, setAuth } = await useAuth();
  if (auth.value) return;
  try {
    const response = await $fetch('/api/self');
    setAuth({ isAuthorized: !!response, user: response })
  } catch { }
})
