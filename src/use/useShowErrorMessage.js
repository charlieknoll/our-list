import { Dialog } from 'quasar'

export function useShowErrorMessage(error) {
  if (!error) return
  console.log(error)
  Dialog.create({
    title: 'Error',
    message: `${error.message}<br><b>Hint</b><br>${error.hint}`,
    html: true,
  })
}
