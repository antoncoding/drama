/**
 *
 * @param timeStamp
 * @returns
 */
export function timeSince(timeStamp: number) {
  const now = Date.now() / 1000;
  const secondsPast = now - timeStamp;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast.toString(), 10)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${parseInt((secondsPast / 60).toString(), 10)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt((secondsPast / 3600).toString(), 10)}h ago`;
  }
  if (secondsPast > 86400) {
    const ts = new Date(timeStamp * 1000);
    const day = ts.getDate();
    const month = (
      ts.toDateString().match(/ [a-zA-Z]*/) as RegExpMatchArray
    )[0].replace(" ", "");
    const year =
      ts.getFullYear() === new Date().getFullYear()
        ? ""
        : ` ${ts.getFullYear()}`;
    return `${day} ${month}${year}`;
  }

  return timeStamp;
}
