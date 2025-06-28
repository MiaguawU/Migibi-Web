function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function simplify(num: number, den: number): string {
  const divisor = gcd(num, den);
  num = num / divisor;
  den = den / divisor;
  return den === 1 ? `${num}` : `${num}/${den}`;
}

function nines(n: number): number {
  return parseInt("9".repeat(n));
}

function analyzeDecimal(value: string): [number, number, number] {
  const dot = value.indexOf(".");
  if (dot === -1) return [2, -1, -1];

  let state = -1;
  let continues = -1;
  let ps = -1;

  const originalLoop = 6;
  let size = 0;
  const checks = new Array(10).fill(-1);

  while (size !== 6) {
    let loop = originalLoop;
    while (loop !== -1) {
      const firstPart = dot + 1 + (originalLoop - loop);
      let part = "";
      try {
        part = value.substring(firstPart, firstPart + size + 1);
      } catch {
        break;
      }

      const partSize = part.length;
      const afterDecimal = value.length - (dot + 1);
      let stop = true;

      for (let index = 0; index < 10; index++) {
        const secondPart = firstPart + partSize + index * partSize;
        if (secondPart + partSize > value.length) {
          break;
        }
        const comparedPart = value.substring(secondPart, secondPart + partSize);
        checks[index] = part === comparedPart ? 1 : 0;
        if (checks[index] !== 1) stop = false;
      }

      if (stop) {
        continues = firstPart;
        ps = partSize;
        break;
      }

      loop--;
    }
    if (continues !== -1) break;
    size++;
  }

  if (continues === -1) {
    state = 2; // constante
  } else {
    state = dot + 1 === continues ? 1 : 0;
  }

  return [state, continues, ps];
}

export function toFraction(input: number | string): string {
  const value = Number(input).toString();

  if (!value.includes(".")) {
    return simplify(parseInt(value), 1);
  }

  const [state, continues, partSize] = analyzeDecimal(value);
  const dot = value.indexOf(".") + 1;

  if (state === 0) {
    const number = value.substring(0, continues + partSize);
    const numOfConst = continues - dot;
    const numOfDecimals = continues + partSize - dot;
    const den = Math.pow(10, numOfDecimals) - Math.pow(10, numOfConst);

    const toSubtract = parseInt(
      number.substring(0, dot - 1) + number.substring(dot, dot + numOfConst)
    );
    let num = parseInt(number.replace(".", ""));
    num -= toSubtract;
    return simplify(num, den);
  }

  if (state === 1) {
    const n = value.substring(0, dot + partSize).replace(".", "");
    let num = parseInt(n);
    const den = nines(partSize);
    const toSubtract = parseInt(value.substring(0, dot - 1));
    num -= toSubtract;
    return simplify(num, den);
  }

  if (state === 2) {
    const num = parseInt(value.replace(".", ""));
    const den = Math.pow(10, value.length - dot);
    return simplify(num, den);
  }

  return "STATE NOT DETERMINED";
}

export function toDecimal(frac: string): string {
  const parts = frac.split("/");
  if (parts.length === 2) {
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    return (numerator / denominator).toString();
  }
  return parseFloat(frac).toString();
}
