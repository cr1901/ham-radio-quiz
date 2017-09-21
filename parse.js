P = Parsimmon;

dash = P.string('-')
comma = P.string(',')
int = P.regex(/\d+/).map(parseInt)
sep = P.seq(comma, P.optWhitespace).or(P.eof);

q_range = P.seq(int, dash, int);
q_sel = q_range.or(int);

range_parser = P.seq(q_sel, sep).many();


function arrayRange(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) {
      return index + start;
  });
}

function parseString(str) {
  res = range_parser.parse(str);

  if(res.status === true) {
    return res.value.reduce(function(acc, range) {
      val = range[0] // Don't need the separator

      // We got a range
      if(typeof val == 'object') {
        begin = val[0]
        end = val[2]
        acc = acc.concat(arrayRange(begin, end - begin + 1))  // Inclusive of end
      } else {
        // Otherwise it's a single number
        acc.push(val)
      }

      return acc
    }, [])
  } else {
    return []
  }
}
