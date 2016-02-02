'use strict';

const http = require('http');
const URL = 'http://interactives.ap.org/2016/primary-election-results/live-data/2016-02-01/data/IA_P_FIPScode.json';

http.get(URL, (res) => {
    let json = '';

    console.log('LOADING DATA...');

    res.on('data', chunk => json += chunk);
    res.on('end', () => {
        const results = JSON.parse(json);
        const race = results.races.find(r => r.party == 'Dem');
        const counties = race.reportingUnits.filter(u => u.level == 'FIPSCode');
        
        let total = 0;
        let popularVotes = {};
        
        for (let i = 0; i < counties.length; i++) {
            let county = counties[i];
            let candidates = county.candidates;
        
            for (let j = 0; j < candidates.length; j++) {
                let candidate = candidates[j];
                let name = candidate.last;
        
                if (!popularVotes.hasOwnProperty(name)) {
                    popularVotes[name] = 0;
                }
        
                total += candidate.voteCount;
                popularVotes[name] += candidate.voteCount;
            }
        }
        
        const names = Object.keys(popularVotes).sort((a,b) =>
            popularVotes[b] - popularVotes[a]);
        
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let votes = popularVotes[name];
            let pc = Math.round(votes / total * 10000) / 100;
            console.log(name + ': ' + votes + ' (' + pc + '%)');
        }
    });
});
