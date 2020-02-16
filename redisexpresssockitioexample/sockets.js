function* bearsScore() {
    yield 'CHI Field Goal CHI 3 - MIN 0';
    yield 'CHI Field Goal CHI 6 - MIN 0';
    yield 'CHI Touchdown CHI 13 - MIN 0';
    yield 'MIN Field Goal CHI 13 - MIN 3';
    yield 'CHI Touchdown CHI 20 - MIN 3';
    yield 'MIN Touchdown CHI 20 - MIN 10';
    yield 'CHI Wins';
}

var brarsNamespace = (socket) => {
    socket.emit('score', 'welcome to bears score update')
    var score = bearsScore();
    var id = setInterval(() => {
        var nextScore = score.next();
        if (nextScore.done) clearInterval(id);
        else socket.emit('score', nextScore.value);
    }, 2000);
}

function* cubsScore() {
    yield 'CHC scores CHC 1 - CLE 0';
    yield 'CLE scores CHC 1 - CLE 1';
    yield 'CHC scores CHC 2 - CLE 1';
    yield 'CHC scores CHC 3 - CLE 1';
    yield 'CHC scores CHC 4 - CLE 1';
    yield 'CHC scores CHC 5 - CLE 1';
    yield 'CLE scores CHC 5 - CLE 3';
    yield 'CHC scores CHC 6 - CLE 3';
    yield 'CLE scores CHC 6 - CLE 4';
    yield 'CLE scores CHC 6 - CLE 6';
    yield 'CHC scores CHC 7 - CLE 6';
    yield 'CHC scores CHC 8 - CLE 6';
    yield 'CLE scores CHC 8 - CLE 7';
    yield 'CHC wins';
}

var cubsNamespace = (socket) => {
    socket.emit('score', 'welcome to cubs score update')
    var score = bearsScore();
    var id = setInterval(() => {
        var nextScore = score.next();
        if (nextScore.done) clearInterval(id);
        else socket.emit('score', nextScore.value);
    }, 2000);
}

module.exports.brarsNamespace = brarsNamespace;
module.exports.cubsNamespace = cubsNamespace;