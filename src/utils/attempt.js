import Cookies from 'js-cookie'

export const QUIZ_DONE_COOKIE = 'quiz_done'      // cookie-name

export function markQuizDone () {
  Cookies.set(QUIZ_DONE_COOKIE, 'true', {
    sameSite : 'strict',
    expires  : 1           // days – tweak as you like
  })
}

export function quizAlreadyDone () {
  return Cookies.get(QUIZ_DONE_COOKIE) === 'true'
}