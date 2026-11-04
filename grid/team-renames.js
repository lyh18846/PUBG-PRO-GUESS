// Targeted identity corrections from the user-maintained team records.
(function(root) {
    'use strict';
    const names = [
        ['AGT', 'AG(泰国)', 'Armory Gaming'], ['AQ', 'QAD', 'Al Qadsiah'],
        ['FIU', 'FIUM', 'FIUMBA'], ['GPT', 'GP', 'GAME PT'],
        ['LEG', 'LGCY', 'Legacy'], ['MG', 'MAG', 'MAGnetic'],
        ['TSG-TS', 'TSG(新)', 'Tang Shan Gaming'],
        ['XME', 'XMEN', 'Xavage Men Esports']
    ];
    const clone = value => JSON.parse(JSON.stringify(value));
    const same = (team, fullName) => team && String(team.fullName || '').trim().toLowerCase() === fullName.toLowerCase();
    function database(input) {
        if (!input || !Array.isArray(input.teams)) return { database: input, mapping: {}, changed: false };
        const next = clone(input), mapping = {};
        for (const [from, to, fullName] of names) {
            const old = next.teams.find(t => t?.id === from), target = next.teams.find(t => String(t?.id || '').toLowerCase() === to.toLowerCase());
            // Never reinterpret an unrelated custom team or silently merge two records.
            if ((old && !same(old, fullName)) || (target && (target.id !== to || !same(target, fullName))) || (old && target)) continue;
            if (!old && !same(target, fullName)) continue;
            mapping[from] = to;
            if (old) {
                old.id = to;
                if (old.name === from) old.name = to;
                if (old.short === from) old.short = to;
            }
        }
        const rename = value => Object.hasOwn(mapping, value) ? mapping[value] : value;
        for (const player of Array.isArray(next.players) ? next.players : []) {
            if (!player || typeof player !== 'object') continue;
            if (Array.isArray(player.teams)) player.teams = [...new Set(player.teams.map(rename))];
            if (player.sourceRecord?.team) player.sourceRecord.team = rename(player.sourceRecord.team);
        }
        for (const asset of Array.isArray(next.logoAssets) ? next.logoAssets : []) {
            if (!asset || typeof asset !== 'object') continue;
            asset.teamId = rename(asset.teamId);
            asset.tag = rename(asset.tag);
        }
        // VC Gaming history and the user-labelled Vietnamese VC artwork are distinct.
        const vietnamId='VC(越南)',vietnamFile='TEAM LOGO/VC(越南).png';
        const vc=next.teams.find(t=>t?.id==='VC'&&same(t,'VC Gaming'));
        const vcFile='TEAM LOGO/VC.png',oldFiles=[vcFile,vietnamFile];
        const assets=Array.isArray(next.logoAssets)?next.logoAssets:[];
        const hasVietnamEntry=assets.some(a=>a?.file===vietnamFile);
        const hasVietnamArt=!!vc&&(oldFiles.includes(vc.logo)||hasVietnamEntry||assets.some(a=>a?.file===vcFile));
        const vietnamTarget=next.teams.find(t=>String(t?.id||'').toLowerCase()===vietnamId.toLowerCase());
        if(hasVietnamArt&&(!vietnamTarget||vietnamTarget.id===vietnamId)){
            if(!vc.logo||oldFiles.includes(vc.logo))vc.logo=vcFile;
            if(!next.teams.some(t=>t?.id===vietnamId))next.teams.push({id:vietnamId,name:vietnamId,short:vietnamId,fullName:'VC（越南）',region:'APAC',color:'#c8d3b3',aliases:[vietnamId],logo:vietnamFile});
            for(const asset of assets)if(asset&&(asset.file===vietnamFile||(!hasVietnamEntry&&asset.file===vcFile))){asset.file=vietnamFile;asset.tag=vietnamId;asset.teamId=vietnamId;}
            if(!assets.some(a=>a?.file===vcFile&&a.teamId==='VC'))assets.push({file:vcFile,tag:'VC',teamId:'VC',historical:false});
            next.logoAssets=assets;
        }
        const changed = JSON.stringify(next) !== JSON.stringify(input);
        return { database: changed ? next : input, mapping, changed };
    }
    function game(input, mapping, players = []) {
        if (!input) return input;
        const next = clone(input);
        for (const axis of ['rows', 'cols']) for (const condition of Array.isArray(next[axis]) ? next[axis] : []) {
            if (condition?.type === 'team' && Object.hasOwn(mapping, condition.id)) condition.id = mapping[condition.id];
        }
        if(Array.isArray(next.answers)&&Array.isArray(players)){
            const canonical=new Map(players.filter(p=>typeof p?.id==='string').map(p=>[p.id.toLowerCase(),p.id]));
            next.answers=next.answers.map(id=>typeof id==='string'?(canonical.get(id.toLowerCase())||id):id);
        }
        return next;
    }
    const api = { names, database, game };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.GridTeamRenames = api;
})(typeof window !== 'undefined' ? window : globalThis);
