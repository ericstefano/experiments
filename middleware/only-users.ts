export default defineNuxtRouteMiddleware(async () => {
  const { auth } = await useAuth();
  if (!auth.value || !auth.value.isAuthorized) return navigateTo('/signin')
})
