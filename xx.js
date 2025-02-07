(function() {
    var initializing = false
      , fnTest = /xyz/.test(function() {
        xyz
    }) ? /\b_super\b/ : /.*/;
    this.Class = function() {}
    ;
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this;
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function(name, fn) {
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret
                }
            }(name, prop[name]) : prop[name]
        }
        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments)
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class
    }
}
)();
var HOUR = 60 * 60 * 1e3;
var DAY = 24 * HOUR;
function render(tmpl_name, tmpl_data) {
    if (!render.tmpl_cache)
        render.tmpl_cache = {};
    if (tmpl_name.startsWith("/"))
        tmpl_name = tmpl_name.slice(1);
    if (!render.tmpl_cache[tmpl_name]) {
        var tmpl_string;
        $.ajax({
            url: `${Config.asset_location}views/${tmpl_name}.html?v=${asset_version}`,
            method: "GET",
            async: false,
            cache: SM.settings.template_caching,
            success: data=>tmpl_string = data
        });
        _.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
        render.tmpl_cache[tmpl_name] = _.template(tmpl_string)
    }
    return render.tmpl_cache[tmpl_name](tmpl_data)
}
function popupCenter(url, title, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    var left = width / 2 - w / 2 + dualScreenLeft;
    var top = height / 2 - h / 2 + dualScreenTop;
    var newWindow = window.open(url, title, "scrollbars=yes, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
    if (window.focus) {
        newWindow.focus()
    }
    return newWindow
}
function Log(msg) {
    if (window.console)
        console.log(msg)
}
function padLeft(nr, n, str) {
    if (String(nr).length > n)
        return String(nr);
    return Array(n - String(nr).length + 1).join(str || "0") + nr
}
function addCommas(nStr, currency) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2")
    }
    if (x2 == "" && currency == 1)
        x2 = ".00";
    return x1 + x2
}
function getMaxLeagueForCP(collection_power) {
    var num = 0;
    if (!collection_power || collection_power < 0) {
        collection_power = 0
    }
    for (var index = 0; index < SM.settings.leagues.length; index++) {
        if (collection_power >= SM.settings.leagues[index].min_power) {
            num = index
        } else {
            break
        }
    }
    return num
}
function getLeaderboard(tier) {
    return (SM.settings.leagues[tier].league_limit - 3) / 3
}
Number.prototype.formatMoney = function(c, d, t) {
    var n = this
      , c = isNaN(c = Math.abs(c)) ? 2 : c
      , d = d == undefined ? "." : d
      , t = t == undefined ? "," : t
      , s = n < 0 ? "-" : ""
      , i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + ""
      , j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")
}
;
function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [, ""])[1].replace(/\+/g, "%20")) || null
}
function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms))
}
function sleep2(ms) {
    let timeoutId;
    let cancel;
    return {
        promise: new Promise((resolve,reject)=>{
            timeoutId = setTimeout(resolve, ms);
            cancel = (()=>{
                clearTimeout(timeoutId);
                reject()
            }
            )
        }
        ),
        cancel: cancel
    }
}
function popup_center(url, title, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    var left = width / 2 - w / 2 + dualScreenLeft;
    var top = height / 2 - h / 2 + dualScreenTop;
    var newWindow = window.open(url, title, "scrollbars=yes, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
    if (window.focus) {
        newWindow.focus()
    }
    return newWindow
}
function scPayment(to, amount, currency, memo) {
    let sc_url = `https://steemconnect.com/sign/transfer?to=${to}&amount=${parseFloat(amount).toFixed(3)}%20${currency}&memo=${encodeURIComponent(memo)}`;
    popup_center(sc_url, `${currency} Payment`, 630, 660)
}
function hiveSignerPayment(to, amount, currency, memo) {
    let sc_url = `https://hivesigner.com/sign/transfer?to=${to}&amount=${parseFloat(amount).toFixed(3)}%20${currency}&memo=${encodeURIComponent(memo)}`;
    popup_center(sc_url, `${currency} Payment`, 630, 660)
}
function vesselPayment(to, amount, currency, memo) {
    var transaction = JSON.stringify([["transfer", {
        from: "",
        to: to,
        amount: parseFloat(amount).toFixed(3) + " " + currency,
        memo: memo
    }]]);
    window.location = "steem://sign/tx/" + btoa(transaction) + "#eyJhbW91bnQiOnsicHJvbXB0IjpmYWxzZSwidHlwZSI6ImFzc2V0IiwibGFiZWwiOiJEb25hdGlvbiJ9LCJtZW1vIjp7InByb21wdCI6ZmFsc2UsInR5cGUiOiJ0ZXh0IiwibGFiZWwiOiJNZXNzYWdlIChPcHRpb25hbCkifSwidG8iOnsicHJvbXB0IjpmYWxzZSwidHlwZSI6InRleHQifX0="
}
function generatePassword(length, rng) {
    if (!rng)
        rng = Math.random;
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      , retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(rng() * n))
    }
    return retVal
}
function sortCards(a, b) {
    var colors = ["Red", "Blue", "Green", "White", "Black", "Gold", "Gray"];
    var a_index = colors.indexOf(a.color) * 1e4 + a.rarity * 1e3 + a.id;
    var b_index = colors.indexOf(b.color) * 1e4 + b.rarity * 1e3 + b.id;
    return a_index - b_index
}
function timeSince(date) {
    var seconds = Math.floor((new Date - date) / 1e3);
    var interval = Math.floor(seconds / 31536e3);
    if (interval > 1) {
        return interval + " years"
    }
    interval = Math.floor(seconds / 2592e3);
    if (interval > 1) {
        return interval + " months"
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days"
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours"
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes"
    }
    return Math.floor(seconds) + " seconds"
}
function getHeadBlock(callback) {
    steem.api.getDynamicGlobalPropertiesAsync().then(result=>{
        if (callback)
            callback(result.head_block_number, result.time)
    }
    )
}
async function getHeadBlockAsync() {
    return await steem.api.getDynamicGlobalPropertiesAsync().then(result=>result.head_block_number).catch(async err=>SM.GetCurrentBlockNum())
}
async function timeUntilBlock(block) {
    var last_block = await getHeadBlockAsync();
    return (block - last_block) * 3 * 1e3
}
async function loadScriptAsync(url) {
    return new Promise(resolve=>loadScript(url, resolve))
}
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback()
            }
        }
    } else if (callback) {
        script.onload = function() {
            callback()
        }
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script)
}
function getLevel(xp, rarity) {
    for (var i = 0; i < SM.settings.xp_levels[rarity - 1].length; i++) {
        if (xp < SM.settings.xp_levels[rarity - 1][i])
            return i + 1
    }
    return SM.settings.xp_levels[rarity - 1].length + 1
}
function updateUrlFragment(fragment) {
    var url = window.location.href;
    var hashIndex = window.location.href.indexOf("#");
    if (hashIndex >= 0)
        url = url.substr(0, hashIndex);
    window.location = url + "#" + fragment
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x
    }
    return a
}
function getQuestRewards(league, quest_name) {
    var quest_details = SM.settings.quests.find(q=>q.name == quest_name);
    if (!quest_details)
        return 0;
    return quest_details.reward_qty_by_league[league]
}
function getCurrency(amount) {
    return amount.substr(amount.indexOf(" ") + 1)
}
function ratingLevelName(lvl) {
    return lvl == 0 ? "Novice" : lvl == 1 ? "Bronze" : lvl == 2 ? "Silver" : lvl == 3 ? "Gold" : "Diamond"
}
function testImage(url, callback, timeout) {
    timeout = timeout || 5e3;
    var timedOut = false, timer;
    var img = new Image;
    img.onerror = img.onabort = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "error")
        }
    }
    ;
    img.onload = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "success")
        }
    }
    ;
    img.src = url;
    timer = setTimeout(function() {
        timedOut = true;
        img.src = "//!!!!/test.jpg";
        callback(url, "timeout")
    }, timeout)
}
function tryParse(json) {
    try {
        return JSON.parse(json)
    } catch (err) {
        console.log("Error trying to parse JSON: " + json);
        return null
    }
}
function constructTournamentAllowedEditionsText(editions) {
    var editionNames = [];
    var editionText = "";
    var allowed_editions = editions.slice(0);
    if (allowed_editions.length === 0) {
        allowed_editions = [0, 1, 2, 3, 4, 5]
    }
    allowed_editions.forEach(edition=>{
        var editionStr = getEdition(edition);
        if (editionStr.toLowerCase() === "orb") {
            editionStr = "Promo"
        }
        editionNames.push(editionStr)
    }
    );
    if (editionNames.length === 0 || editionNames.length === SM.settings.num_editions) {
        editionText = "All Editions Allowed"
    } else {
        if (editionNames.length > 1) {
            editionText = editionNames.join(", ") + " Editions Allowed"
        } else {
            editionText = editionNames[0] + " Edition Only"
        }
    }
    return {
        editionNames: editionNames,
        editionText: editionText
    }
}
function cardsAllowed(type, foil) {
    if (!foil) {
        switch (type) {
        case "gold_only":
            return "Gold Cards Only";
        case "alpha_only":
            return "Alpha Cards Only";
        case "no_legendaries":
            return "No Legendary Cards";
        case "no_legendary_summoners":
            return "No Legendary Summoners";
        default:
            return "All Cards Playable"
        }
    }
    if (type === "all" && foil === "all") {
        return "All Cards Playable"
    }
    var allowed = [];
    switch (type) {
    case "no_legendaries":
        allowed.push("No Legendaries");
        break;
    case "no_legendary_summoners":
        allowed.push("No Legendary Summoners");
        break
    }
    if (foil === "gold_only") {
        allowed.push("Gold Cards Only")
    }
    return allowed.join(", ")
}
function sendGuildChatNotification(title, message, guild_id) {
    if (localStorage.getItem("sl:guild_chat_notif_disabled"))
        return;
    desktopNotification(title, "https://d36mxiodymuqjm.cloudfront.net/website/nav/icon_nav_guilds_active@2x.png", message, ()=>SM.Guilds.ShowGuild(guild_id, "tavern"))
}
function sendNotification(title, icon, message, onclick) {
    if (!SM.Player || !SM.Player.settings.notifications_enabled)
        return;
    desktopNotification(title, icon, message, onclick)
}
function desktopNotification(title, icon, message, onclick) {
    var notification = null;
    try {
        if (Notification.permission !== "granted")
            Notification.requestPermission(p=>{
                if (p === "granted") {
                    notification = new Notification(title,{
                        icon: icon,
                        body: message
                    })
                }
            }
            );
        else {
            notification = new Notification(title,{
                icon: icon,
                body: message
            })
        }
        if (notification && onclick)
            notification.addEventListener("click", onclick)
    } catch (err) {}
}
function getSplinter(color) {
    return color == "Red" ? "Fire" : color == "Blue" ? "Water" : color == "Green" ? "Earth" : color == "Black" ? "Death" : color == "White" ? "Life" : color == "Gray" ? "Neutral" : "Dragon"
}
function getEdition(edition) {
    return ["Alpha", "Beta", "Orb", "Reward", "Untamed", "Dice", "Gladius"][edition]
}
function getEditionByName(edition) {
    return ["ALPHA", "BETA", "ORB", "REWARD", "UNTAMED", "DICE", "GLADIUS"].indexOf(edition.toUpperCase())
}
function getMaxLevel(rarity) {
    return rarity == 1 ? 10 : rarity == 2 ? 8 : rarity == 3 ? 6 : 4
}
function enhancedTrim(text) {
    return text.trim().replace(/^[\u200B-\u200D\uFEFF]+|[\u200B-\u200D\uFEFF]+$/g, "")
}
function xss(text) {
    while (text.match(/onload/gi))
        text = text.replace(/onload/gi, "");
    while (text.match(/onerror/gi))
        text = text.replace(/onerror/gi, "");
    while (text.match(/javascript/gi))
        text = text.replace(/javascript/gi, "");
    while (text.match(/&#/gi))
        text = text.replace(/&#/gi, "");
    while (text.match(/<\/?script>/gi))
        text = text.replace(/<\/?script>/gi, "");
    return text
}
function serverDate(date_str, subtract_seconds) {
    let date = new Date(new Date(date_str).getTime() + SM._server_time_offset);
    if (subtract_seconds)
        date = new Date(date.getTime() - subtract_seconds * 1e3);
    return date
}
function toUSD(payment) {
    return (parseFloat(payment) * SM.settings[getCurrency(payment).toLowerCase() + "_price"]).toFixed(2)
}
function calculateDEC(card) {
    var details = SM.GetCardDetails(card.card_detail_id);
    var alpha_bcx = 0
      , alpha_dec = 0;
    var xp = Math.max(card.xp - card.alpha_xp, 0);
    let burn_rate = card.edition == 4 || details.tier == 4 ? SM.settings.dec.untamed_burn_rate[details.rarity - 1] : SM.settings.dec.burn_rate[details.rarity - 1];
    if (card.alpha_xp) {
        var alpha_bcx_xp = SM.settings[card.gold ? "gold_xp" : "alpha_xp"][details.rarity - 1];
        alpha_bcx = Math.max(card.gold ? card.alpha_xp / alpha_bcx_xp : card.alpha_xp / alpha_bcx_xp, 1);
        alpha_dec = burn_rate * alpha_bcx * SM.settings.dec.alpha_burn_bonus;
        if (card.gold)
            alpha_dec *= SM.settings.dec.gold_burn_bonus
    }
    var xp_property = card.edition == 0 || card.edition == 2 && details.id < 100 ? card.gold ? "gold_xp" : "alpha_xp" : card.gold ? "beta_gold_xp" : "beta_xp";
    var bcx_xp = SM.settings[xp_property][details.rarity - 1];
    var bcx = Math.max(card.gold ? xp / bcx_xp : (xp + bcx_xp) / bcx_xp, 1);
    if (card.edition == 4 || details.tier == 4)
        bcx = card.xp;
    if (card.alpha_xp)
        bcx--;
    var dec = burn_rate * bcx;
    if (card.gold)
        dec *= SM.settings.dec.gold_burn_bonus;
    if (card.edition == 0)
        dec *= SM.settings.dec.alpha_burn_bonus;
    if (card.edition == 2)
        dec *= SM.settings.dec.promo_burn_bonus;
    var total_dec = dec + alpha_dec;
    if (card.xp >= getMaxXp(details, card.edition, card.gold))
        total_dec *= SM.settings.dec.max_burn_bonus;
    return total_dec
}
function calculateECR(capture_rate, last_reward_time) {
    return Math.min((isNaN(parseInt(capture_rate)) ? 1e4 : capture_rate) + (Date.now() - new Date(last_reward_time)) / 3e3 * SM.settings.dec.ecr_regen_rate, 1e4)
}
function isCardLocked(card) {
    return card.lock_days > 0 && (!card.unlock_date || new Date(card.unlock_date) > new Date)
}
function isCardUnlocking(card) {
    return card.unlock_date && new Date(card.unlock_date) > new Date
}
function getBalance(symbol) {
    if (!SM.Player || !SM.Player.balances)
        return 0;
    var record = SM.Player.balances.find(b=>b.token == symbol);
    return record ? record.balance : 0
}
_sponsors = {
    "bitcoin-com": "https://exchange.bitcoin.com/?utm_source=ingame&utm_medium=banner&utm_campaign=exchange_promo&utm_term=splinterlands"
};
function showSponsor(name, asset, url) {
    SM.LogEvent(`sponsor_link_click`, {
        asset: asset,
        name: name
    });
    window.open(url || _sponsors[name])
}
function countUp(element, from, to, decimals) {
    if (!to)
        to = 0;
    to = parseFloat(to);
    if (isNaN(to))
        to = 0;
    var amount = to - from;
    var step = 1
      , interval = 1;
    var decimals = decimals ? decimals : countDecimals(from);
    var decimals_to = decimals ? decimals : to >= 1e3 ? 0 : Math.min(countDecimals(to), 3);
    if (amount < 1) {
        element.text(addCommas(to.toFixed(decimals_to)));
        return
    }
    if (amount > 500)
        step = amount / 500;
    if (amount < 300)
        interval = Math.min(300 / amount, 100);
    update();
    function update() {
        setTimeout(()=>{
            from += step;
            element.text(addCommas(from.toFixed(decimals)));
            if (from < to)
                update();
            else
                element.text(addCommas(to.toFixed(decimals_to)))
        }
        , interval)
    }
}
function countDecimals(value) {
    if (value % 1 != 0)
        return value.toString().split(".")[1].length;
    return 0
}
function getSkins(card_detail_id) {
    if (!SM.Player || !SM.Player.skins)
        return [];
    return SM.Player.skins.filter(s=>s.card_detail_id == card_detail_id)
}
function timeout(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms))
}
function getDecCost(cost) {
    return SM.Player && SM.Player.guild && SM.Player.guild.quest_lodge_level ? +(cost * (1 - SM.settings.guilds.shop_discount_pct[SM.Player.guild.quest_lodge_level - 1] / 100)).toFixed(1) : cost
}
function getMaxMembers(level) {
    return SM.settings.guilds.guild_hall.member_limit[level - 1]
}
function getStarterCard(card_details) {
    let starter_edition = parseInt(card_details.editions.split(",").find(e=>SM.settings.starter_editions.includes(parseInt(e))));
    if (!starter_edition || card_details.rarity > 2)
        return null;
    return {
        uid: `starter-${card_details.id}-${generatePassword(5)}`,
        card_detail_id: card_details.id,
        gold: false,
        xp: starter_edition >= 4 ? 1 : 0,
        edition: starter_edition,
        level: 1
    }
}
function showError(message) {
    new Noty({
        type: "alert",
        theme: "sm",
        timeout: 3e4,
        text: message
    }).show()
}
function cardsToLevel(card_detail_id, edition, gold, level) {
    let details = SM.GetCardDetails(card_detail_id);
    if (edition == 4 || details.tier == 4) {
        let rates = gold ? SM.settings.combine_rates_gold[details.rarity - 1] : SM.settings.combine_rates[details.rarity - 1];
        let cards = rates[level - 1];
        return cards <= 0 ? "N/A" : cards
    } else {
        let xp_levels = SM.settings.xp_levels[details.rarity - 1];
        let bcx = SM.settings[edition == 0 || edition == 2 && card_detail_id < 100 ? gold ? "gold_xp" : "alpha_xp" : gold ? "beta_gold_xp" : "beta_xp"][details.rarity - 1];
        let gold_na = [3, 2, 2, 1];
        return gold ? level <= gold_na[details.rarity - 1] ? "N/A" : Math.ceil(xp_levels[level - 2] / bcx) : level == 1 ? 1 : Math.ceil(xp_levels[level - 2] / bcx) + 1
    }
}
function getMaxXp(details, edition, gold) {
    let rarity = details.rarity;
    let tier = details.tier;
    if (edition == 4 || tier == 4) {
        let rates = gold ? SM.settings.combine_rates_gold[rarity - 1] : SM.settings.combine_rates[rarity - 1];
        return rates[rates.length - 1]
    } else
        return SM.settings.xp_levels[rarity - 1][SM.settings.xp_levels[rarity - 1].length - 1]
}
window.abilities = [{
    name: "Affliction",
    desc: "When a Monster with Affliction hits a target, it has a chance of applying Affliction on the target causing it to be unable to be healed.",
    effect_name: "Afflicted",
    effect_desc: "This monster may not be healed."
}, {
    name: "Blast",
    desc: "Does additional damage to Monsters adjacent to the target Monster."
}, {
    name: "Blind",
    desc: "All enemy Melee & Ranged attacks have an increased chance of missing their target.",
    effect_name: "Blinded",
    effect_desc: "Reduced chance of hitting with MELEE and RANGED attacks."
}, {
    name: "Bloodlust",
    desc: "Every time this Monster defeats an opponent, it gets +1 to all stats (in the Reverse Speed ruleset, -1 to Speed)."
}, {
    name: "Cleanse",
    desc: "Removes all negative effects on the Monster in the first position on the friendly team."
}, {
    name: "Demoralize",
    desc: "Reduces the Melee attack of all enemy Monsters.",
    effect_name: "Demoralized",
    effect_desc: "-1 to MELEE ATTACK"
}, {
    name: "Divine Shield",
    desc: "The first time the Monster takes damage it is ignored.",
    effect_name: "Shielded",
    effect_desc: "The first time this monster takes damage it is ignored."
}, {
    name: "Dodge",
    desc: "Has an increased chance of evading Melee or Ranged attacks."
}, {
    name: "Double Strike",
    desc: "Monster attacks twice each round."
}, {
    name: "Enrage",
    desc: "Has increased Melee attack and Speed when damaged.",
    effect_name: "Enraged",
    effect_desc: "Enraged monsters get increased speed and attack damage when not at full health."
}, {
    name: "Flying",
    desc: "Has an increased chance of evading Melee or Ranged attacks from Monsters who do not have the Flying ability."
}, {
    name: "Halving",
    desc: "Each time this Monster hits a target , the target's attack is cut in half (rounded down).",
    effect_name: "Halved",
    effect_desc: "Attack stats cut in half"
}, {
    name: "Headwinds",
    desc: "Reduces the Ranged attack of all enemy Monsters.",
    effect_name: "Headwinds",
    effect_desc: "-1 to RANGED ATTACK"
}, {
    name: "Heal",
    desc: "Restores a portion of the Monster's health each round."
}, {
    name: "Tank Heal",
    desc: "Restores a portion of the Monster in the first position's health each round."
}, {
    name: "Inspire",
    desc: "Gives all friendly Monsters +1 Melee attack.",
    effect_name: "Inspired",
    effect_desc: "+1 to MELEE ATTACK"
}, {
    name: "Knock Out",
    desc: "Does double damage when attacking an enemy that is stunned."
}, {
    name: "Last Stand",
    desc: "Gains increased stats if it's the only Monster on the team alive.",
    effect_name: "Last Stand",
    effect_desc: "+50% to all stats"
}, {
    name: "Life Leech",
    desc: "Monster's health increases each time it damages an enemy Monster's health in proportion to the damage dealt."
}, {
    name: "Magic Reflect",
    desc: "When hit with Magic damage, does reduced Magic damage back to the attacker."
}, {
    name: "Opportunity",
    desc: "Monsters with the Opportunity ability may attack from any position and will target the enemy Monster with the lowest health."
}, {
    name: "Oppress",
    desc: "Does double damage when attacking an enemy that has no attack."
}, {
    name: "Piercing",
    desc: "If Melee or Ranged attack damage is in excess of the target's Armor, the remainder will damage the target's Health."
}, {
    name: "Poison",
    desc: "Attacks have a chance to apply poison, which does automatic damage to the target at the beginning of each round after the poison is applied.",
    effect_name: "Poisoned",
    effect_desc: "Poisoned monsters take 2 damage at the start of each round."
}, {
    name: "Protect",
    desc: "All friendly Monsters gain +2 Armor.",
    effect_name: "Protected",
    effect_desc: "+2 to ARMOR"
}, {
    name: "Reach",
    desc: "Melee attack Monsters with the Reach ability may attack from the second position on the team."
}, {
    name: "Redemption",
    desc: "When this Monster dies, it does 2 damage to all enemy monsters."
}, {
    name: "Repair",
    desc: "Restores some armor to the friendly Monster whose armor has taken the most damage."
}, {
    name: "Resurrect",
    desc: "When a friendly Monster dies it is brought back to life with 1 Health. This ability can only trigger once per battle."
}, {
    name: "Retaliate",
    desc: "When hit with a Melee attack, Monsters with Retaliate have a chance of attacking their attacker."
}, {
    name: "Return Fire",
    desc: "When hit with a Ranged attack, Monsters with Return Fire will return reduced damage back to their attacker."
}, {
    name: "Rust",
    desc: "Reduces the Armor of all enemy Monsters.",
    effect_name: "Rusted",
    effect_desc: "-2 Armor"
}, {
    name: "Scavenger",
    desc: "Gains 1 max health each time any monster dies."
}, {
    name: "Shatter",
    desc: "Target's armor is destroyed when hit by an attack from Monsters with Shatter."
}, {
    name: "Shield",
    desc: "Reduced damage from Melee and Ranged attacks."
}, {
    name: "Silence",
    desc: "Reduces the Magic Attack of all enemy Monsters.",
    effect_name: "Silenced",
    effect_desc: "-1 to MAGIC ATTACK"
}, {
    name: "Slow",
    desc: "Reduces the Speed of all enemy Monsters.",
    effect_name: "Slowed",
    effect_desc: "-1 to SPEED"
}, {
    name: "Snare",
    desc: "When attacking enemies with Flying, removes the Flying ability and cannot miss.",
    effect_name: "Snared",
    effect_desc: "Loses the Flying ability"
}, {
    name: "Sneak",
    desc: "Targets the last Monster on the enemy Team instead of the first Monster."
}, {
    name: "Snipe",
    desc: "Targets enemy Monsters with Ranged, Magic, or no attack that are not in the first position."
}, {
    name: "Strengthen",
    desc: "All friendly Monsters have increased Health.",
    effect_name: "Strengthened",
    effect_desc: "+1 to HEALTH"
}, {
    name: "Stun",
    desc: "When a Monster with Stun hits a target, it has a chance to stun the target causing it to skip its next turn.",
    effect_name: "Stunned",
    effect_desc: "Stunned monsters skip their next turn."
}, {
    name: "Swiftness",
    desc: "All friendly Monsters have increased Speed.",
    effect_name: "Swiftened",
    effect_desc: "+1 to SPEED"
}, {
    name: "Taunt",
    desc: "All enemy Monsters target this Monster (if they are able to)."
}, {
    name: "Thorns",
    desc: "When hit with a Melee attack, does damage back to the attacker."
}, {
    name: "Trample",
    desc: "When a Monster with Trample hits and kills its target, it will perform another attack on the next Monster on the enemy Team."
}, {
    name: "Triage",
    desc: "Heals the friendly back-line Monster that has taken the most damage."
}, {
    name: "Void",
    desc: "Reduced damage from Magic attacks."
}, {
    name: "Weaken",
    desc: "Reduces the Health of all enemy Monsters.",
    effect_name: "Weakened",
    effect_desc: "-1 to HEALTH"
}, {
    name: "Void Armor",
    desc: "Magic attacks hit this Monster's armor before its Health."
}, {
    name: "Immunity",
    desc: "This monster is immune to negative status effects."
}, {
    name: "Cripple",
    desc: "Each time an enemy is hit by a Monster with Cripple it loses one max health.",
    effect_name: "Crippled",
    effect_desc: "-1 to MAX HEALTH"
}, {
    name: "Close Range",
    desc: "Monsters with the Close Range ability can use Ranged attack from the first position."
}, {
    name: "True Strike",
    desc: "This Monster's attacks cannot miss."
}, {
    name: "Phase",
    desc: "Magic attacks can miss this Monster (using the same hit/miss calculation as for Melee and Ranged attacks)."
}, {
    name: "Dispel",
    desc: "When this monster hits an enemy, it clears all buffs and positive status effects on that enemy."
}];
function makeQuerystring(obj) {
    if (isNonObject(obj)) {
        return ""
    }
    return Object.entries(obj).map(kv=>kv.join("=")).join("&")
}
function isNonObject(x) {
    return typeof x !== "object" || x === null || x === undefined
}
function getHoldingAcct(chain) {
    let accounts = {
        tron: "sm-packs",
        steem_engine: "sl-steem",
        hive_engine: "sl-hive",
        wax: "sl-wax"
    };
    return accounts[chain]
}
function getSupportedCurrency(symbol) {
    if (!symbol)
        return null;
    return SM.settings.supported_currencies.find(c=>c.currency == symbol.toUpperCase())
}
function and() {
    const fns = Array.from(arguments);
    return function(element, index, array) {
        return fns.reduce(function(acc, fn) {
            return acc && fn(element, index, array)
        }, true)
    }
}
function or() {
    const fns = Array.from(arguments);
    return function(element, index, array) {
        return fns.reduce(function(acc, fn) {
            return acc || fn(element, index, array)
        }, false)
    }
}
function createCountdown(timestamp, elements, onComplete) {
    let intervalId;
    const SEC = 1e3;
    const MIN = 60 * SEC;
    const HR = 60 * MIN;
    const DAY = 24 * HR;
    const offsetExpiration = serverDate(timestamp, 0);
    onInterval();
    intervalId = setInterval(onInterval, SEC);
    function onInterval() {
        const timeRemainingMs = updateTimerCT(offsetExpiration);
        if (timeRemainingMs <= 0) {
            if (onComplete)
                onComplete()
        }
    }
    function updateTimerCT(expiration) {
        const ts = Math.max(expiration - Date.now(), 0);
        const days = Math.floor(ts / DAY);
        const hrs = Math.floor(ts % DAY / HR);
        const mins = Math.floor(ts % HR / MIN);
        const secs = Math.floor(ts % HR % MIN / SEC);
        const daysPadded = padLeft(days, 2, "0");
        const hrsPadded = padLeft(hrs, 2, "0");
        const minsPadded = padLeft(mins, 2, "0");
        const secsPadded = padLeft(secs, 2, "0");
        if (elements.countdown) {
            elements.countdown.textContent = [daysPadded, hrsPadded, minsPadded, secsPadded].join(":")
        } else {
            if (elements.days) {
                elements.days.textContent = daysPadded
            }
            if (elements.hours) {
                elements.hours.textContent = hrsPadded
            }
            if (elements.minutes) {
                elements.minutes.textContent = minsPadded
            }
            if (elements.seconds) {
                elements.seconds.textContent = secsPadded
            }
        }
        return ts
    }
    return intervalId
}
const logger = store=>next=>action=>{
    console.group(action.type);
    console.log("Previous state:", store.getState());
    console.log("Action", action);
    const result = next(action);
    console.log("Next state:", store.getState());
    console.groupEnd()
}
;
function isMobileDevice() {
    return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1
}
var _urlHash = window.location.hash ? window.location.hash : window.location.search;
var _init_url_search_params = new URLSearchParams(_urlHash.substring(_urlHash.indexOf("?")));
function getInitUrlSearchParams() {
    return _init_url_search_params
}
async function WomplaySignUp() {
    if (getInitUrlSearchParams().get("uid")) {
        let womplay_id = await SM.GetPlayerProperty("womplay_id");
        let new_womplay_id = getInitUrlSearchParams().get("uid");
        if (!womplay_id.value && new_womplay_id) {
            await SM.ECApiAsync("/womplay/sign_up", {
                womplay_id: new_womplay_id
            })
        }
    }
}
async function WomplayTracking(event_name) {
    let womplay_id = await SM.GetPlayerProperty("womplay_id");
    if (womplay_id.value) {
        await SM.ECApiAsync("/womplay/tracking", {
            womplay_id: womplay_id.value,
            event_name: event_name
        })
    }
}
function removeTxPrefix(tx_name) {
    return tx_name.replace(SM.settings.test_mode ? `${SM.settings.prefix}sm_` : "sm_", "")
}
function fsm(schema) {
    function callAll(fns, withEvent, withState, withPrevState) {
        if (!fns)
            return;
        if (Array.isArray(fns)) {
            fns.forEach(function(fn) {
                if (!fn)
                    return;
                fn(withEvent, withState, withPrevState)
            })
        } else {
            fns && fns(withEvent, withState, withPrevState)
        }
    }
    return {
        schema: schema,
        curStateName: schema.initial,
        canTransition(event, curState) {
            return curState.on && curState.on[event.type]
        },
        transition(event, state, prevState) {
            const curState = schema.states[this.curStateName];
            if (!this.canTransition(event, curState))
                return;
            callAll(curState.onExit, event, state, prevState);
            const transition = this.findTransition(event, curState, state);
            if (!transition)
                return;
            this.executeActions(transition.actions, event, state, prevState);
            const nextState = schema.states[transition.target];
            this.curStateName = transition.target;
            callAll([this.onTransition].concat(nextState.onEnter || []), event, state, prevState)
        },
        onTransition: ()=>{}
        ,
        findTransition(event, curState, state) {
            if (Array.isArray(curState.on[event.type])) {
                const transition = curState.on[event.type].find(function(t) {
                    return t.cond ? t.cond(event, state) : true
                });
                return transition
            }
            return {
                target: curState.on[event.type]
            }
        },
        executeActions(actions, event, state, prevState) {
            callAll(actions || [], event, state, prevState)
        }
    }
}
SM = {
    cards: [],
    items: [],
    settings: {},
    Player: null,
    details_tab: "cards",
    collection_filters: {
        ownership: "playable",
        gold: false,
        foil: ["Regular"],
        elements: [],
        rarities: [],
        types: [],
        edition: []
    },
    _timer_interval: -1,
    editions: ["Alpha", "Beta", "Promo", "Reward"],
    timers: {},
    current_tournament: null,
    current_watched: null,
    current_brawl_cycle: null,
    in_battle: false,
    balance_update_deferred: false,
    _session_id: null,
    _browser_id: null,
    _use_keychain: false,
    _server_time_offset: 0,
    _rpc_index: 0,
    Api: function(url, data, callback, always) {
        if (data == null || data == undefined)
            data = {};
        data.v = (new Date).getTime();
        if (SM.Player) {
            data.token = SM.Player.token;
            data.username = SM.Player.name
        }
        jQuery.getJSON(Config.api_url + url, data, function(response) {
            if (callback != null && callback != undefined)
                callback(response)
        }).fail(e=>{
            if (callback != null && callback != undefined)
                callback(e)
        }
        ).always(function() {
            if (always)
                always()
        })
    },
    ECApi: function(url, data, callback, always) {
        if (data == null || data == undefined)
            data = {};
        data.v = (new Date).getTime();
        if (SM.Player) {
            data.token = SM.Player.token;
            data.username = SM.Player.name
        }
        jQuery.getJSON(Config.external_chain_api_url + url, data, function(response) {
            if (callback != null && callback != undefined)
                callback(response)
        }).fail(e=>{
            if (callback != null && callback != undefined)
                callback(e)
        }
        ).always(function() {
            if (always)
                always()
        })
    },
    Post: function(url, data, callback, always) {
        if (data == null || data == undefined)
            data = {};
        data.v = (new Date).getTime();
        if (SM.Player) {
            data.token = SM.Player.token;
            data.username = SM.Player.name
        }
        jQuery.post(Config.api_url + url, data, function(response) {
            if (callback != null && callback != undefined)
                callback(response)
        }).fail(e=>{
            if (callback != null && callback != undefined)
                callback(e)
        }
        ).always(function() {
            if (always)
                always()
        })
    },
    async Put(url, data) {
        data.v = (new Date).getTime();
        if (SM.Player) {
            data.token = SM.Player.token;
            data.username = SM.Player.name
        }
        return fetch(url, {
            method: "PUT",
            body: JSON.stringify(data)
        })
    },
    async Delete(url, data) {
        data.v = (new Date).getTime();
        if (SM.Player) {
            data.token = SM.Player.token;
            data.username = SM.Player.name
        }
        return fetch(url, {
            method: "DELETE",
            body: JSON.stringify(data)
        })
    },
    ApiAsync: function(url, data) {
        return new Promise((resolve,reject)=>{
            if (data == null || data == undefined)
                data = {};
            data.v = (new Date).getTime();
            if (SM.Player) {
                data.token = SM.Player.token;
                data.username = data.username || SM.Player.name
            }
            jQuery.getJSON(Config.api_url + url, data, r=>resolve(r))
        }
        )
    },
    ECApiAsync: function(url, data) {
        return new Promise((resolve,reject)=>{
            if (data == null || data == undefined)
                data = {};
            data.v = (new Date).getTime();
            if (SM.Player) {
                data.token = SM.Player.token;
                data.username = data.username || SM.Player.name
            }
            jQuery.getJSON(Config.external_chain_api_url + url, data, r=>resolve(r))
        }
        )
    },
    ECPostAsync: function(url, data) {
        return new Promise((resolve,reject)=>{
            if (data == null || data == undefined)
                data = {};
            data.v = (new Date).getTime();
            if (SM.Player) {
                data.token = SM.Player.token;
                data.username = SM.Player.name
            }
            jQuery.post(Config.external_chain_api_url + url, data, r=>resolve(r))
        }
        )
    },
    LogEvent: async function(event_name, data) {
        return await SM.ApiAsync("/players/event", {
            browser_id: SM._browser_id,
            session_id: SM._session_id,
            event_name: event_name,
            page: SM.CurrentView ? SM.CurrentView.view : "",
            user_agent: window.navigator.userAgent,
            browser_language: window.navigator.language,
            site_language: localStorage.getItem("locale"),
            ref: localStorage.getItem("ref"),
            data: JSON.stringify(data),
            url: localStorage.getItem("splinterlands:url")
        })
    },
    RenderCurrentView: function renderCurrentView() {
        if (SM.CurrentView) {
            $("#page_container").html(render(SM.CurrentView.view, {
                data: SM.CurrentView.data
            }))
        }
    },
    SetTranslator: function setTranslator(polyglot, defaultLocale) {
        locale = defaultLocale = defaultLocale || "en";
        if (!polyglot) {
            console.warn("Missing dependency: Polyglot@3.0.2");
            SM.Translator = {
                locale(l) {},
                extend() {},
                replace() {},
                t(key, options) {
                    return options && options._
                }
            }
        }
        var polyglot = new polyglot;
        SM.Translator = {
            locale(l) {
                if (l === undefined || l === null) {
                    return polyglot.locale()
                }
                SM.ShowLoading();
                $.get(`${Config.asset_location}locale/${l}.json?v=${asset_version}`, res=>{
                    SM.Translator.replace(res || {});
                    SM.TranslateIndex();
                    SM.RenderCurrentView();
                    SM.HideLoading()
                }
                );
                return polyglot.locale(l)
            },
            extend(phrases) {
                return polyglot.extend(phrases)
            },
            replace(phrases) {
                return polyglot.replace(phrases)
            },
            t(key, options) {
                return polyglot.t(key, options)
            }
        };
        SM.Translator.locale(defaultLocale)
    },
    TranslateIndex: function translateIndex() {
        const elements = document.querySelectorAll("[data-translate]");
        if (!elements)
            return;
        elements.forEach(function(el) {
            const translation = SM.Translator.t(el.dataset.translate);
            if (translation == el.dataset.translate)
                return;
            if (el.text) {
                el.text = translation
            } else if (el.textContent) {
                el.textContent = translation
            }
        })
    },
    ShowHomeView: function(view, data, url_params) {
        if (!("ontouchstart"in document.documentElement)) {
            $('[data-toggle="tooltip"]').tooltip("destroy")
        }
        SM.ClearTimers();
        $('[data-toggle="tooltip"]').tooltip("hide");
        window.scrollTo(0, 0);
        $("body").css("overflow", "auto");
        $("body").css("padding-right", "0");
        if (SM.settings.maintenance_mode && (!SM.Player || !SM.Player.is_team))
            view = "maintenance";
        SMBSounds.StopMainBattleTheme();
        $("#page_container").html(render(view, {
            data: data
        }));
        if (!("ontouchstart"in document.documentElement))
            $('[data-toggle="tooltip"]').tooltip({
                html: true,
                container: "body"
            });
        SM.LastView = SM.CurrentView;
        SM.CurrentView = {
            view: view,
            data: data
        };
        if (SMBPortrait.Team1 != null)
            SMBPortrait.Team1.CleanUp();
        if (SMBPortrait.Team2 != null)
            SMBPortrait.Team2.CleanUp();
        if (window.innerWidth <= 990) {
            var burger = $(".navbar-toggle");
            if (!burger.hasClass("collapsed"))
                burger.click()
        }
        var url = view == "about" ? "/" : "?p=" + view + (url_params ? "&" + $.param(url_params) : "");
        if (window.location.search == url)
            window.history.replaceState({
                data: null,
                view: view,
                params: url_params
            }, "Splinterlands - Collect, Trade, Battle!", url);
        else
            window.history.pushState({
                data: null,
                view: view,
                params: url_params
            }, "Splinterlands - Collect, Trade, Battle!", url);
        if (current_tournament && current_tournament.format !== "swiss" && current_tournament.matchup && view != "tournament" && view != "create_team2" && view != "battle" && (!SM._noties.tournament_return || SM._noties.tournament_return.closed))
            SM.ShowNoty("tournament_return", "tournament_return", {
                id: current_tournament.id
            }, false);
        if (window.fbq)
            fbq("track", "ViewContent", {
                content_ids: view
            });
        snapyr.page(null, view, null)
    },
    ShowDialog: function(dialog, data, url, onClose, no_backdrop) {
        if (SM._activeDialog != null && SM._activeDialog.hasClass("in")) {
            $(".modal-backdrop").remove();
            SM.HideDialog()
        }
        if (url == null || url == undefined) {
            SM.RenderDialog(dialog, data, function() {
                SM.OnDialogHidden(onClose)
            }, no_backdrop)
        } else {
            SM.Api(url, data, function(response) {
                SM.RenderDialog(dialog, response, function() {
                    SM.OnDialogHidden(onClose)
                }, no_backdrop)
            })
        }
        SM._activeDialogName = dialog
    },
    _activeDialog: null,
    _activeDialogName: null,
    OnDialogHidden: function(callback) {
        if (SM._activeDialog == null || !SM._activeDialog.hasClass("in")) {
            SM._activeDialog = null
        }
        if (callback) {
            callback()
        }
        $(".modal-backdrop").remove();
        SM._activeDialogName = null
    },
    _loading: $('<div class="modal-backdrop fade in loading-backdrop"><img src="https://d36mxiodymuqjm.cloudfront.net/website/loading-spinner_500.gif" class="loading" /></div>'),
    ShowLoading: function() {
        SM._loading.appendTo("body")
    },
    HideLoading: function() {
        $(".loading-backdrop").remove()
    },
    ShowPackOpenVideo: function(edition) {
        var video = $('<div id="divVideo" style="position:absolute; top: 0; z-index: 10000; width: 100vw;">' + '<video style="width: 100%;" onended="SM.PackOpenVideoEnded();" onclick="this.play()" autoplay>' + '<source src="https://d36mxiodymuqjm.cloudfront.net/website/vfx/pack-opening_' + edition + '.mp4" type="video/mp4">' + "</video></div>");
        video.appendTo("body");
        if (!SM.Player.settings.mute_all) {
            let pack_open_audio = edition === 6 ? new Audio("https://d36mxiodymuqjm.cloudfront.net/website/sfx/SiteUI_GladiusCase_PackOpenAnimation.mp3") : new Audio("https://d36mxiodymuqjm.cloudfront.net/website/sfx/SiteUI_OpenPack_PackOpenAnimation.mp3");
            pack_open_audio.currentTime = 0;
            pack_open_audio.play()
        }
    },
    RenderDialog: function(dialog, data, onClose, no_backdrop) {
        if (dialog.startsWith("/"))
            dialog = dialog.slice(1);
        $("#dialog_container").html(render("dialogs/" + dialog, {
            data: data
        }));
        SM._activeDialog = $("#dialog_container").children(".modal");
        SM._activeDialog.modal({
            backdrop: no_backdrop == "static" ? "static" : !no_backdrop
        });
        SM._activeDialog.modal("show");
        if (onClose)
            SM._activeDialog.on("hidden.bs.modal", onClose)
    },
    HideDialog: function(cancelEvents, onHidden) {
        if (!SM._activeDialog) {
            if (onHidden) {
                onHidden()
            }
            return
        }
        if (cancelEvents)
            SM._activeDialog.off("hidden.bs.modal");
        if (onHidden) {
            SM._activeDialog.on("hidden.bs.modal", function() {
                SM.OnDialogHidden(onHidden)
            })
        }
        SM._activeDialog.modal("hide");
        $("body").css("padding-right", "0");
        SM._activeDialogName = null
    },
    HighlightMenuItem: function(item) {
        $("#menu_list li").removeClass("active");
        $("#menu_item_" + item).addClass("active")
    },
    ShowComponent: function(component, data) {
        if (component.startsWith("/"))
            component = component.slice(1);
        return render("/components/" + component, {
            data: data
        })
    },
    ShowUrlPage(url) {
        if (getURLParameter("status") == "paypal_complete")
            SM.PaypalComplete();
        var parts = JSON.parse('{"' + xss(decodeURI(url)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        if (parts.battle) {
            SM.LoadBattle(parts.battle);
            return
        }
        if (!parts.p) {
            SM.ShowAbout();
            return
        }
        switch (parts.p) {
        case "admin":
            SM.ShowHomeView("admin");
            break;
        case "packs":
            SM.ShowShop();
            break;
        case "open_packs":
            SM.ShowOpenPacks();
            break;
        case "mana_well":
            SM.ShowOpenPacks();
            break;
        case "market":
        case "market_coming_soon":
            SM.LoadCards(()=>SM.ShowMarket(parts.tab));
            break;
        case "collection":
            SM.LoadCards(()=>SM.ShowCollection(parts.a));
            break;
        case "items":
            SM.ShowItemInvetory();
            break;
        case "card_details":
            if (SM.Player)
                SM.LoadCards(()=>SM.LoadCollection(SM.Player.name, true, ()=>SM.ShowCardDetails(parts.id, parts.gold == "true", parseInt(parts.edition), parts.tab)));
            else
                SM.LoadCards(()=>SM.ShowCardDetails(parts.id, parts.gold == "true", parseInt(parts.edition), parts.tab));
            break;
        case "card_info":
            SM.LoadCards(()=>SM.ShowCardInfo(parts.id, parts.tab));
            break;
        case "faq":
            SM.ShowFAQ();
            break;
        case "gameplay":
            SM.ShowGameplay();
            break;
        case "shop":
            SM.LoadCards(()=>SM.ShowShop(parts.tab));
            break;
        case "battle_history":
            SM.ShowBattleHistory();
            break;
        case "battle":
            if (parts.id)
                SM.LoadBattle(parts.id);
            break;
        case "tournaments":
            SM.ShowTournaments();
            break;
        case "tournament":
            SM.ShowTournament(parts.id);
            break;
        case "tournament_create":
            SM.ShowHomeView("tournament_create");
            break;
        case "pack_verifier":
            var params = {
                qty: parts.qty,
                trx: parts.trx,
                block: parts.block,
                bid: parts.bid,
                pid: parts.pid,
                edition: parts.edition,
                potlegqty: parts.potlegqty,
                potalcqty: parts.potalcqty,
                bloodqty: parts.bloodqty,
                powerqty: parts.powerqty
            };
            SM.ShowHomeView("pack_verifier", params, params);
            break;
        case "lottery_verifier":
            SM.ShowHomeView("lottery_verifier");
            break;
        case "raffle_verifier":
            SM.ShowHomeView("raffle_verifier");
            break;
        case "airdrop_verifier":
            var params = {
                qty: parts.qty,
                trx: parts.trx,
                block: parts.block,
                bid: parts.bid,
                pid: parts.pid,
                card: parts.c
            };
            SM.ShowHomeView("airdrop_verifier", params, params);
            break;
        case "tournament_power":
            SM.ShowHomeView("tournament_power");
            break;
        case "guilds":
            SM.Guilds.ShowGuilds();
            break;
        case "guild":
            if (parts.tab === "brawl") {
                SM.Guilds.ShowGuild(parts.id, parts.tab, "show-intro")
            } else {
                SM.Guilds.ShowGuild(parts.id, parts.tab)
            }
            break;
        case "banish":
            SM.Guilds.ShowBanishSelect(parts.id, parts.card_num);
            break;
        case "pwd_reset":
            SM.ShowHomeView("pwd_reset", {
                email: parts.e,
                ts: parts.ts,
                sig: parts.sig
            });
            break;
        case "request_keys":
            SM.ShowHomeView("request_keys", {
                email: parts.e,
                ts: parts.ts,
                sig: parts.sig
            });
            break;
        case "verify_email":
            SM.VerifyEmail(decodeURIComponent(parts.e), parts.ts, decodeURIComponent(parts.sig));
            break;
        case "marketing_unsubscribe":
            SM.ShowHomeView("marketing_unsubscribe", {
                email: parts.email,
                token: parts.token
            });
            break;
        case "privacy":
            SM.ShowHomeView("privacy");
            break;
        case "terms":
            SM.ShowHomeView("terms");
            break;
        case "sps_management":
            SM.ShowHomeView("sps_management");
            break;
        case "payment":
            SM.ShowDialog("shop/ext_payment", {
                amount: parts.amount,
                memo: parts.memo
            });
            SM.ShowAbout();
            break;
        default:
            SM.ShowAbout();
            break
        }
    },
    VerifyEmail: function(email, ts, sig) {
        SM.Api("/players/verify_email", {
            email: email,
            ts: ts,
            sig: sig
        }, r=>{
            console.log(r);
            if (r && r.success)
                alert("Your email address has been successfully verified!")
        }
        );
        SM.ShowAbout()
    },
    ShowLogin: function(callback) {
        if (SM.Player) {
            SM.ShowBattleHistory()
        } else
            SM.ShowDialog("login", null, null, callback)
    },
    Logout: function() {
        localStorage.removeItem("username");
        localStorage.removeItem("key");
        SM.Player = null;
        Messenger.Close();
        current_tournament = null;
        if (SM._noties.tournament_return && !SM._noties.tournament_return.closed) {
            SM._noties.tournament_return.close()
        }
        $("#log_in_button").show();
        $("#log_in_text").hide();
        $(".dec-nav-item").removeClass("active");
        SM.ShowAbout();
        SM._collectionLoaded = false;
        SM.LogEvent("log_out");
        snapyr.reset()
    },
    Init: function() {
        SM._browser_id = localStorage.getItem("browser_id");
        SM._session_id = "sid_" + generatePassword(20);
        if (!SM._browser_id) {
            SM._browser_id = "bid_" + generatePassword(20);
            localStorage.setItem("browser_id", SM._browser_id)
        }
        SM.LoadSettings(function() {
            var username = localStorage.getItem("username");
            if (username) {
                SM.ShowLoading();
                setTimeout(function() {
                    SM.SavedLogin(()=>{
                        if (window.performance && performance.navigation.type == 0)
                            SM.LogEvent("site_visit");
                        if (window.location.search)
                            SM.ShowUrlPage(window.location.search.substr(1));
                        else
                            SM.ShowAbout();
                        if (getURLParameter("battle"))
                            SM.LoadBattle(getURLParameter("battle"))
                    }
                    )
                }, 500)
            } else if (window.location.search) {
                if (window.performance && performance.navigation.type == 0)
                    SM.LogEvent("site_visit");
                SM.ShowUrlPage(window.location.search.substr(1))
            } else {
                if (window.performance && performance.navigation.type == 0)
                    SM.LogEvent("site_visit");
                SM.ShowAbout()
            }
            SM.LoadCards();
            SM.LoadItems();
            if (getURLParameter("verify_raffle"))
                SM.ShowHomeView("raffle_verifier");
            if (getURLParameter("verify_rewards"))
                SM.ShowHomeView("reward_verifier");
            if (getURLParameter("ref") || localStorage.getItem("ref")) {
                var ref = getURLParameter("ref");
                if (!ref)
                    ref = localStorage.getItem("ref")
            }
        });
        setInterval(SM.LoadSettings, 60 * 1e3);
        $("#page_container").css("min-height", window.innerHeight - 248 + "px")
    },
    SavedLogin: function(callback) {
        SM.Login(null, null, function(response) {
            SM.HideLoading();
            var success = false;
            if (response && response.success) {
                $("#log_in_button").show();
                SM.OnLogin();
                success = true
            } else {
                $("#log_in_button").show();
                $("#log_in_text").hide();
                $(".dec-nav-item").removeClass("active")
            }
            if (callback)
                callback(success)
        })
    },
    OnLogin: async function(is_new) {
        $("#log_in_button").hide();
        $("#log_in_text").show();
        SM.Api("/players/authenticate");
        $(".dec-nav-item").addClass("active");
        $("#log_in_text .bio__name__display").text(SM.Player.display_name || SM.Player.name);
        $("#log_in_text .bio__avatar").html(SM.ShowComponent("avatar", SM.Player));
        await timeout(500);
        if (!SM.settings.maintenance_mode || SM.Player.is_team) {
            let suppress_brawl_in_progress = false;
            SM.Player.messages.filter(m=>["payment", "brawl_fray_status", "brawl_only_guild"].includes(m.type)).forEach(m=>{
                let data = tryParse(m.data);
                SM.MarkAsRead(m.id);
                if (m.type == "payment") {
                    new Noty({
                        type: "success",
                        theme: "sm",
                        timeout: 3e4,
                        text: "You got a payment of " + data.amount + " " + data.currency + " for reason: " + data.reason
                    }).show()
                } else if (m.type == "brawl_fray_status" && SM.Player.guild && SM.Player.guild.id === data.guild_id && SM.Player.guild.tournament_id === data.tournament_id) {
                    if (data.type === "cancel") {
                        suppress_brawl_in_progress = true
                    }
                    SM.ShowNoty(data.id, "brawl_fray_status", data, false)
                } else if (m.type == "brawl_only_guild" && SM.Player.guild && SM.Player.guild.id === data.guild_id && SM.settings.brawl_cycle.id === data.brawl_cycle_id) {
                    SM.ShowNoty(`${data.block_num}-${data.guild_id}`, "brawl_only_guild", data, false)
                }
            }
            );
            let lottery_result_msg = SM.Player.messages.find(m=>m.type == "lottery_result");
            if (!suppress_brawl_in_progress && SM.Player.guild && SM.Player.guild.tournament_id && SM.Player.guild.tournament_status === 0 && isNaN(SM.Player.guild.my_fray_index)) {
                let frays_open = SM.settings.frays[SM.Player.guild.tournament_data.challenge_level].length - SM.Player.guild.frays_filled;
                if (frays_open > 0) {
                    SM.ShowNoty(SM.Player.guild.tournament_id + "-in-progress", "brawl_in_progress", {
                        id: SM.Player.guild.tournament_id,
                        type: "prep_stage",
                        frays_open: frays_open,
                        expiration_block_num: SM.GetCurrentBlockNum() + 20
                    }, true);
                    suppress_brawl_in_progress = true
                }
            }
            if (SM.Player.outstanding_match && !SM.Player.outstanding_match.is_critical) {
                if (SM.Player.outstanding_match.tournament_format && SM.Player.outstanding_match.tournament_format === "swiss") {
                    SM.ShowNoty(SM.Player.outstanding_match.tournament_id + "-in-progress", "swiss_in_progress", {
                        id: SM.Player.outstanding_match.tournament_id,
                        expiration_block_num: SM.GetCurrentBlockNum() + 20
                    }, true)
                }
                if (SM.Player.outstanding_match.brawl_id && SM.Player.guild && !suppress_brawl_in_progress) {
                    SM.ShowNoty(SM.Player.outstanding_match.brawl_id + "-in-progress", "brawl_in_progress", {
                        id: SM.Player.outstanding_match.brawl_id,
                        expiration_block_num: SM.GetCurrentBlockNum() + 20
                    }, true)
                }
            }
            if (SM.Player.outstanding_match && SM.Player.outstanding_match.is_critical) {
                SM.OutstandingMatch(SM.Player.outstanding_match)
            } else if (SM.Player.use_proxy && SM.Player.starter_pack_purchase) {
                if (SM.Player.alt_name) {
                    SM.ShowLoading();
                    SM.UpgradeAccount(SM.Player.alt_name)
                } else {
                    SM.ShowDialog("choose_name", null, null, null, "static")
                }
            } else if (lottery_result_msg) {
                SM.MarkAsRead(lottery_result_msg.id);
                SM.ShowDialog("shop/lottery_results", tryParse(lottery_result_msg.data))
            } else if (!SM.ShowAnnouncement(is_new)) {
                let gifts = SM.Player.messages.filter(m=>m.type == "received_gifts").map(g=>{
                    var data = tryParse(g.data);
                    if (data)
                        data.msg_id = g.id;
                    return data
                }
                ).filter(g=>g != null);
                if (gifts.length > 0)
                    SM.ShowDialog("gifts2", gifts);
                if (SM.Player.unrevealed_rewards && SM.Player.unrevealed_rewards.length > 0)
                    SM.ShowUnrevealedRewards(SM.Player.unrevealed_rewards[0]);
                SM.ShowMysteryRewards(SM.Player.messages.filter(m=>m.type == "mystery_reward"));
                SM.Player.messages.filter(m=>m.type == "guild_update").forEach(m=>{
                    let data = tryParse(m.data);
                    SM.MarkAsRead(m.id);
                    SM.ShowNoty(data.id, "guild_update", data)
                }
                );
                SM.Player.messages.filter(m=>m.type == "challenge").forEach(m=>SM.ShowChallenge(m))
            }
        }
        Messenger.Connect(SM.Player.name, SM.Player.token);
        SM.LogEvent("log_in");
        SM.LoadMarketData();
        SM.OnLoadBalances(SM.Player.balances);
        if (SM.Player.is_admin || SM.Player.is_cs_admin)
            $("#nav_admin").show();
        if (SM.Player.starter_pack_purchase && SM.Player.keys_available)
            $("#nav_keys").show();
        if (window.fbq)
            fbq("trackCustom", "login", {
                name: SM.Player.name
            });
        loadScript("https://platform.twitter.com/oct.js", ()=>{
            twttr.conversion.trackPid("o5rpo", {
                tw_sale_amount: 0,
                tw_order_quantity: 0
            })
        }
        );
        dataLayer.push({
            event: "login",
            playerName: SM.Player.name
        })
    },
    UpgradeAccount: function(name, key) {
        SM.BroadcastCustomJson("sm_upgrade_account", "Upgrade Account", {
            account_name: name
        }, tx=>{
            if (tx.error) {
                SM.HideLoading();
                return
            }
            SM.Login(name, key, r=>{
                SM.HideLoading();
                if (r && r.success) {
                    SM.OnLogin();
                    SM.ShowDialog("starter_set")
                }
            }
            )
        }
        )
    },
    LoadBalances: function(callback, always) {
        if (callback)
            callback(SM.Player.balances);
        if (always)
            always()
    },
    OnLoadBalances: function(balances) {
        if (SM.Player) {
            SM.Player.balances = balances;
            var dec = balances.find(r=>r.token == "DEC");
            var from = parseFloat($(".dec-container .balance").text().replace(/,/g, ""));
            if (!from || isNaN(from))
                from = 0;
            countUp($(".dec-container .balance"), from, dec ? dec.balance : 0);
            let credits = balances.find(r=>r.token == "CREDITS");
            from = parseFloat($(".credits-container .balance").text().replace(/,/g, ""));
            if (!from || isNaN(from))
                from = 0;
            countUp($(".credits-container .balance"), from, credits ? credits.balance : 0);
            var ecr_balance = balances.find(r=>r.token == "ECR");
            if (ecr_balance && ecr_balance.balance) {
                SM.Player.capture_rate = ecr_balance.balance;
                SM.Player.last_reward_block = ecr_balance.last_reward_block;
                SM.Player.last_reward_time = ecr_balance.last_reward_time
            }
            var ecr = Math.round(calculateECR(SM.Player.capture_rate, SM.Player.last_reward_time));
            $(".dec-right .dec-container .ecr-bar").css("width", Math.round(ecr / 1e4 * 100) + "px");
            $(".dec-left .dec-container .ecr-bar").css("width", Math.round(ecr / 1e4 * 100) + "px");
            $(".dec-container").append(SM.ShowComponent("dec_options", {
                balance: dec ? addCommas(dec.balance) : 0,
                capture_rate: (ecr / 100).toFixed(2) + "%"
            }));
            let sps = balances.find(r=>r.token == "SPS");
            from = parseFloat($(".sps-container .balance").text().replace(/,/g, ""));
            if (!from || isNaN(from))
                from = 0;
            countUp($(".sps-container .balance"), from, sps ? sps.balance : 0)
        }
    },
    GetBalance: function(token) {
        if (!SM.Player || !SM.Player.balances)
            return 0;
        var balance = SM.Player.balances.find(b=>b.token == token);
        return balance ? parseFloat(balance.balance) : 0
    },
    ShowUnrevealedRewards: function(result) {
        if (!result)
            return;
        result.rewards = tryParse(result.rewards);
        if (!result.rewards || result.rewards.length == 0)
            return;
        var n = new Noty({
            type: "reveal_rewards",
            data: {
                qty: result.rewards.length,
                sg_promo: false
            },
            callbacks: {
                onClick: ()=>SM.RevealRewards(result, result.type)
            }
        });
        n.show()
    },
    RevealRewards: function(result, type) {
        if (!result)
            return;
        if (result.rewards) {
            SM.ShowDialog("open_loot_chest", {
                items: result.rewards,
                potions: [],
                type: type,
                reward_tx_id: result.reward_tx_id
            });
            return
        }
        let cards = result.cards;
        if (!cards || cards.length == 0)
            return;
        if (!result.potions)
            result.potions = {
                legendary: null,
                gold: null
            };
        let sg_promo = cards.some(c=>c.card_detail_id >= 114 && c.card_detail_id <= 117);
        let groups = _.groupBy(cards, c=>c.card_detail_id + "#" + c.gold);
        let data = _.map(groups, function(group) {
            return {
                card_ids: group.map(g=>g.uid),
                card_detail_id: group[0].card_detail_id,
                edition: group[0].edition,
                rarity: SM.GetCardDetails(group[0].card_detail_id).rarity,
                gold: group[0].gold,
                qty: group.length,
                xp: group[0].xp
            }
        });
        data = shuffle(data);
        SM.ShowDialog("open_rewards", {
            cards: data,
            potions: result.potions,
            rewards: result.rewards,
            type: sg_promo ? "promo" : type
        })
    },
    Login: async function(username, key, callback) {
        if (key && key.startsWith("STM")) {
            if (callback)
                callback({
                    success: false,
                    error: "This appears to be a public key. You must use your private posting key to log in."
                });
            return
        }
        if (key && !steem.auth.isWif(key)) {
            key = steem.auth.getPrivateKeys(username, key, ["posting"]).posting
        }
        if (!username)
            username = localStorage.getItem("username");
        if (!key)
            key = localStorage.getItem("key");
        SM._use_keychain = !key;
        username = username && username.length > 0 ? username.toLowerCase().trim() : "";
        if (username && username.startsWith("@"))
            username = username.substr(1);
        if (!window.hive_keychain && (!username || !key) || window.hive_keychain && !username) {
            if (callback)
                callback({
                    success: false,
                    error: "Account name or key is missing."
                });
            return
        }
        let params = {
            name: username.toLowerCase(),
            ref: localStorage.getItem("ref"),
            browser_id: SM._browser_id,
            session_id: SM._session_id,
            ts: Date.now()
        };
        if (!SM._use_keychain) {
            try {
                steem.auth.wifToPublic(key)
            } catch (err) {
                if (callback)
                    callback({
                        success: false,
                        error: "Invalid password or private posting key for account @" + username
                    });
                return
            }
            params.sig = eosjs_ecc.sign(username + params.ts, key)
        } else {
            params.sig = await new Promise(resolve=>hive_keychain.requestSignBuffer(username, username + params.ts, "Posting", r=>resolve(r.result)));
            if (!params.sig) {
                callback({
                    success: false,
                    error: "Unable to log in with account @" + username
                });
                return
            }
        }
        SM.Api("/players/login", params, function(response) {
            if (response.error) {
                if (callback)
                    callback({
                        success: false,
                        error: response.error
                    });
                return
            }
            localStorage.setItem("username", username);
            if (!SM._use_keychain)
                localStorage.setItem("key", key);
            SM.Player = response;
            if (callback)
                callback({
                    success: true,
                    player: SM.Player
                });
            snapyr.identify(SM.Player.alt_name || SM.Player.name, {
                join_date: SM.Player.join_date,
                starter_pack_purchase: SM.Player.starter_pack_purchase,
                email: SM.Player.email
            });
            snapyr.track("login", {
                is_mobile: false
            });
            WomplaySignUp()
        })
    },
    LoginWithWax: function(params) {
        if (params) {
            localStorage.setItem("wax_login_data", JSON.stringify(params))
        }
        const querystring = makeQuerystring(params);
        const w = window.open(`${Config.api_url}/auth/wax/waa?${querystring}`, "_blank", "width=400,height=860");
        const closeWindowPollerId = setInterval(()=>{
            if (w.closed) {
                clearInterval(closeWindowPollerId);
                SM.HideLoading()
            }
        }
        , 1e3)
    },
    EmailLogin: async function(email, password, is_new) {
        email = email.toLowerCase();
        let params = {
            email: email
        };
        let password_key = steem.auth.getPrivateKeys(email, password).owner;
        params.ts = Date.now();
        params.sig = eosjs_ecc.sign(email + params.ts, password_key);
        let response = await SM.ApiAsync("/players/login_email", params);
        if (response.error)
            return response;
        return await new Promise(resolve=>{
            SM.Login(response.username, response.posting_key, r=>{
                if (r && r.success)
                    SM.OnLogin(is_new);
                resolve(r)
            }
            )
        }
        )
    },
    CreateAccountEOS: async function(email, subscribe, is_test) {
        let account = await WalletUtils.getScatterIdentity(WalletUtils.config.scatter.eos_network, "eos");
        let params = {
            login_type: "eos",
            purchase_id: "new-" + generatePassword(6),
            email: email,
            address: account.name,
            password_pub_key: account.publicKey,
            subscribe: subscribe,
            is_test: is_test,
            ref: localStorage.getItem("ref"),
            ref_url: localStorage.getItem("splinterlands:url"),
            browser_id: SM._browser_id
        };
        let response = await SM.ApiAsync("/players/create_email", params);
        if (response && !response.error) {
            let login_response = await SM.EOSLogin(true);
            if (login_response && login_response.success)
                SM.HideDialog();
            if (window.fbq)
                fbq("track", "CompleteRegistration");
            loadScript("https://platform.twitter.com/oct.js", ()=>{
                twttr.conversion.trackPid("o4d37", {
                    tw_sale_amount: 0,
                    tw_order_quantity: 0
                })
            }
            );
            dataLayer.push({
                event: "sign-up",
                playerName: SM.Player.alt_name || SM.Player.name
            });
            SM.LogEvent("sign_up");
            snapyr.track("sign_up", {
                playerName: SM.Player.alt_name || SM.Player.name,
                type: "eos"
            });
            return login_response
        }
        return response
    },
    EOSLogin: async function(is_new) {
        try {
            let params = await WalletUtils.scatterAuth(WalletUtils.config.scatter.eos_network, "eos");
            let response = await SM.ApiAsync("/players/login_eos", params);
            if (response.error)
                return response;
            return await new Promise(resolve=>{
                SM.Login(response.username, response.posting_key, r=>{
                    if (r && r.success)
                        SM.OnLogin(is_new);
                    resolve(r)
                }
                )
            }
            )
        } catch (err) {
            return err
        }
    },
    CreateAccountEth: async function(email, subscribe, is_test) {
        let account = await WalletUtils.getWeb3Identity();
        let params = {
            login_type: "ethereum",
            purchase_id: "new-" + generatePassword(6),
            email: email,
            address: account.publicKey,
            password_pub_key: account.publicKey,
            subscribe: subscribe,
            is_test: is_test,
            ref: localStorage.getItem("ref"),
            ref_url: localStorage.getItem("splinterlands:url"),
            browser_id: SM._browser_id
        };
        let response = await SM.ApiAsync("/players/create_eth", params);
        if (response && !response.error) {
            let login_response = await SM.EthLogin(true);
            if (login_response && login_response.success)
                SM.HideDialog();
            if (window.fbq)
                fbq("track", "CompleteRegistration");
            loadScript("https://platform.twitter.com/oct.js", ()=>{
                twttr.conversion.trackPid("o4d37", {
                    tw_sale_amount: 0,
                    tw_order_quantity: 0
                })
            }
            );
            dataLayer.push({
                event: "sign-up",
                playerName: SM.Player.alt_name || SM.Player.name
            });
            SM.LogEvent("sign_up");
            snapyr.track("sign_up", {
                playerName: SM.Player.alt_name || SM.Player.name,
                type: "eth"
            });
            return login_response
        }
        return response
    },
    EthLogin: async function(is_new) {
        try {
            const params = await WalletUtils.web3Auth();
            const response = await SM.ECApiAsync("/players/login_eth", params);
            if (response.error)
                return response;
            return await new Promise(resolve=>{
                SM.Login(response.username, response.posting_key, r=>{
                    if (r && r.success)
                        SM.OnLogin(is_new);
                    resolve(r)
                }
                )
            }
            )
        } catch (err) {
            return err
        }
    },
    ArkaneAuth: async function() {
        await loadScriptAsync("https://unpkg.com/@arkane-network/arkane-connect@1.19.0/dist/connect.js");
        const arkaneConnect = new ArkaneConnect(SM.settings.arkane ? SM.settings.arkane.client_id : "Splinterlands",{
            environment: SM.settings.arkane ? SM.settings.arkane.env : ""
        });
        const authResult = await arkaneConnect.flows.authenticate();
        return new Promise(resolve=>{
            authResult.authenticated(instance=>resolve([arkaneConnect, instance])).notAuthenticated(instance=>resolve([arkaneConnect, {
                error: "Arkane Network failed to authenticate your credentials."
            }]))
        }
        )
    },
    CreateAccountArkane: async function(subscribe, is_test) {
        const [arkaneConnect,authResponse] = await SM.ArkaneAuth();
        if (!authResponse.authenticated)
            return authResponse;
        const profile = await arkaneConnect.api.getProfile();
        const params = {
            purchase_id: "new-" + generatePassword(6),
            email: profile.email,
            subscribe: subscribe,
            is_test: is_test,
            ref: localStorage.getItem("ref"),
            ref_url: localStorage.getItem("splinterlands:url"),
            browser_id: SM._browser_id
        };
        const response = await SM.ApiAsync("/auth/arkane/create_account", params);
        if (response && !response.error) {
            let login_response = await SM.ArkaneLogin(true, [arkaneConnect, authResponse]);
            if (login_response && login_response.success)
                SM.HideDialog();
            if (window.fbq)
                fbq("track", "CompleteRegistration");
            loadScript("https://platform.twitter.com/oct.js", ()=>{
                twttr.conversion.trackPid("o4d37", {
                    tw_sale_amount: 0,
                    tw_order_quantity: 0
                })
            }
            );
            dataLayer.push({
                event: "sign-up",
                playerName: SM.Player.alt_name || SM.Player.name
            });
            SM.LogEvent("sign_up");
            snapyr.track("sign_up", {
                playerName: SM.Player.alt_name || SM.Player.name,
                type: "arkane"
            })
        }
        return response
    },
    ArkaneLogin: async function(is_new, arkaneAuth) {
        let[arkaneConnect,authResponse] = arkaneAuth || [];
        if (!arkaneConnect) {
            const arkaneAuthTuple = await SM.ArkaneAuth();
            arkaneConnect = arkaneAuthTuple[0];
            authResponse = arkaneAuthTuple[1];
            if (!authResponse.authenticated)
                return authResponse
        }
        const profile = await arkaneConnect.api.getProfile();
        const querystring = makeQuerystring({
            email: profile.email,
            access_token: authResponse.token,
            ts: Date.now()
        });
        const loginResponse = await fetch(`${Config.external_chain_api_url}/players/login_arkane?${querystring}`);
        const loginData = await loginResponse.json();
        if (loginData.error) {
            return Object.assign({
                email: profile.email
            }, loginData)
        } else {
            return new Promise(resolve=>{
                SM.Login(loginData.username, loginData.posting_key, r=>{
                    if (r && r.success) {
                        SM.OnLogin(is_new);
                        resolve(r)
                    }
                }
                )
            }
            )
        }
    },
    CreateAccountEmail: async function(email, password, subscribe, is_test) {
        email = email.toLowerCase();
        let password_pub_key = steem.auth.getPrivateKeys(email, password).ownerPubkey;
        let params = {
            purchase_id: "new-" + generatePassword(6),
            email: email,
            password_pub_key: password_pub_key,
            subscribe: subscribe,
            is_test: is_test,
            ref: localStorage.getItem("ref"),
            ref_url: localStorage.getItem("splinterlands:url"),
            browser_id: SM._browser_id
        };
        let response = await SM.ApiAsync("/players/create_email", params);
        if (response && !response.error) {
            let login_response = await SM.EmailLogin(email, password, true);
            if (window.fbq)
                fbq("track", "CompleteRegistration");
            loadScript("https://platform.twitter.com/oct.js", ()=>{
                twttr.conversion.trackPid("o4d37", {
                    tw_sale_amount: 0,
                    tw_order_quantity: 0
                })
            }
            );
            dataLayer.push({
                event: "sign-up",
                playerName: SM.Player.alt_name || SM.Player.name
            });
            SM.LogEvent("sign_up");
            snapyr.track("sign_up", {
                playerName: SM.Player.alt_name || SM.Player.name,
                type: "email"
            });
            return login_response
        }
        return response
    },
    UpdatePlayerSeasonInfo: async function() {
        if (!SM.Player)
            return;
        let result = await SM.ApiAsync("/players/refresh_season_data");
        if (result && !result.error) {
            SM.Player = Object.assign(SM.Player, result)
        }
    },
    UpdatePlayerInfo: async function() {
        if (!SM.Player)
            return;
        let result = await SM.ApiAsync("/players/details", {
            name: SM.Player.name
        });
        SM.Player = Object.assign(SM.Player, result)
    },
    ShowAnnouncement: function(is_new) {
        if (is_new) {
            SM.ShowDialog("welcome", null, null, null, "static");
            return false
        }
        if (SM.settings.promotions && SM.settings.promotions.includes("brave") && !localStorage.getItem("sm-brave_shown")) {
            localStorage.setItem("sm-brave_shown", true);
            SM.ShowDialog("misc/promotions/brave");
            return true
        }
        let last_shown = localStorage.getItem("sm-daily_update_shown");
        if (!last_shown || Date.now() - new Date(last_shown).getTime() > 8 * 60 * 60 * 1e3) {
            localStorage.setItem("sm-daily_update_shown", (new Date).toISOString());
            if (SM.settings.promotions && SM.settings.promotions.includes("land_presale"))
                SM.ShowDialog("shop/land_presale");
            else
                SM.ShowDailyUpdate();
            return true
        }
        return false
    },
    ShowAdmin: function() {
        SM.ShowHomeView("admin")
    },
    ShowAbout: function() {
        SM.HighlightMenuItem("about");
        if (SM.Player !== null) {
            SM.ShowHomeView("about-player")
        } else {
            SM.ShowHomeView("about")
        }
    },
    ShowMarket: function(tab) {
        SM.HighlightMenuItem("market");
        SM.ShowHomeView(["land", "other"].includes(tab) ? "market_coming_soon" : "market", {
            tab: tab || "cards"
        }, {
            tab: tab || "cards"
        })
    },
    ShowFAQ: function() {
        SM.HighlightMenuItem("faq");
        SM.Api("/players/faq/" + localStorage.getItem("locale"), null, r=>SM.ShowHomeView("faq", r))
    },
    _market_items_grouped: [],
    _rental_items_grouped: [],
    LoadMarketData: function(type, level, callback, always) {
        let url = type == "rentals" ? "for_rent_grouped" : "for_sale_grouped";
        SM.Api(`/market/${url}`, {
            level: level
        }, function(response) {
            var data = response.map(r=>{
                var card = SM.GetCardDetails(r.card_detail_id);
                return Object.assign({
                    id: r.card_detail_id,
                    rarity: card.rarity,
                    color: card.color,
                    name: card.name,
                    type: card.type,
                    circulation: SM.GetCardDistribution(r.card_detail_id, r.gold, r.edition).num_cards
                }, r)
            }
            );
            if (!level) {
                if (type == "rentals")
                    SM._rental_items_grouped = data;
                else
                    SM._market_items_grouped = data
            }
            if (callback)
                callback(data)
        }, always)
    },
    ShowGameplay: function() {
        SM.HighlightMenuItem("gameplay");
        SM.ShowHomeView("gameplay")
    },
    ShowShop: async function(tab) {
        SM.HighlightMenuItem("shop");
        await SM.UpdatePlayerInfo();
        if (tab === "guild" && (!SM.Player || !SM.Player.guild || SM.Player.guild.buildings.guild_shop.level < 1)) {
            tab = "packs"
        }
        SM.ShowHomeView("shop", {
            tab: tab
        }, {
            tab: tab
        })
    },
    ShowOpenPacks: async function(source) {
        SM.HighlightMenuItem("open");
        await SM.UpdatePlayerInfo();
        SM.ShowHomeView("mana_well")
    },
    ResetFilters: function() {
        SM.collection_filters = {
            ownership: "playable",
            gold: false,
            foil: ["Regular"],
            elements: [],
            rarities: [],
            types: [],
            edition: []
        }
    },
    ShowItemInvetory: function(player, filters) {
        if (player && player.length > 17)
            player = null;
        if (!player && SM.Player)
            player = SM.Player.name;
        SM.HighlightMenuItem("collection");
        SM.ShowHomeView("items", {
            player: player,
            filters: filters
        }, {
            a: player
        })
    },
    ShowCollection: function(player, filters) {
        if (player && player.length > 17)
            player = null;
        if (!player && SM.Player)
            player = SM.Player.name;
        SM.HighlightMenuItem("collection");
        SM.ShowHomeView("collection", {
            player: player,
            filters: filters
        }, {
            a: player
        })
    },
    _collectionLoaded: false,
    LoadCollection: async function(name, reload, callback, always) {
        if (name && (!SM._collectionLoaded || reload || SM.Player.collection_dirty)) {
            console.log("***** LOADING COLLECTION *****");
            SM.Api("/cards/collection/" + name, null, function(response) {
                var collection = SM.cards.map(c=>Object.assign({}, c));
                collection.forEach(c=>c.owned = []);
                for (var i = 0; i < response.cards.length; i++) {
                    var card = response.cards[i];
                    var collection_card = collection.find(c=>c.id == card.card_detail_id);
                    if (collection_card)
                        collection_card.owned.push(Object.assign(card, SM.GetCardLevelInfo(card)))
                }
                collection.forEach(c=>{
                    c.owned = c.owned.sort((a,b)=>{
                        return b.level == a.level && b.gold == a.gold ? b.uid < a.uid ? 1 : -1 : (b.gold ? .1 : 0) + b.level - ((a.gold ? .1 : 0) + a.level)
                    }
                    );
                    if (SM.Player && SM.Player.name == name && c.owned.length == 0) {
                        let starter_card = getStarterCard(c);
                        if (starter_card)
                            c.owned.push(Object.assign(starter_card, SM.GetCardLevelInfo(starter_card)))
                    }
                }
                );
                if (SM.Player && SM.Player.name == name) {
                    SM._collectionLoaded = true;
                    SM.CalcCollectionValue(collection);
                    SM.cards = collection;
                    SM.Player.collection_dirty = false
                }
                if (callback)
                    callback(collection)
            }, function() {
                if (always)
                    always()
            });
            if (SM.Player && SM.Player.name == name)
                SM.Api("/players/skins", {}, r=>SM.Player.skins = r)
        } else if (callback)
            callback(SM.cards)
    },
    GroupCollection: function(collection) {
        var result = [];
        collection.forEach(details=>{
            details.editions.split(",").forEach(edition=>{
                result.push({
                    id: details.id,
                    card_detail_id: details.id,
                    rarity: details.rarity,
                    color: details.color,
                    name: details.name,
                    type: details.type,
                    stats: details.stats,
                    gold: false,
                    edition: parseInt(edition),
                    owned: details.owned ? details.owned.filter(o=>o.gold == false && o.edition == parseInt(edition)).slice() : []
                });
                result.push({
                    id: details.id,
                    card_detail_id: details.id,
                    rarity: details.rarity,
                    color: details.color,
                    name: details.name,
                    type: details.type,
                    stats: details.stats,
                    gold: true,
                    edition: parseInt(edition),
                    owned: details.owned ? details.owned.filter(o=>o.gold == true && o.edition == parseInt(edition)).slice() : []
                })
            }
            )
        }
        );
        return result
    },
    LoadSkins: async function() {
        SM._skins = await SM.ApiAsync("/cards/skins");
        SM._skin_sets = SM._skins.reduce((t,v)=>{
            var set = t.find(s=>s.set == v.set && s.skin == v.skin);
            if (!set)
                t.push({
                    set: v.set,
                    skin: v.skin,
                    cost: v.set_cost,
                    available: v.remaining > 0
                });
            else if (v.remaining <= 0)
                set.available = false;
            return t
        }
        , []).sort((a,b)=>a.cost - b.cost)
    },
    LoadCards: function(callback) {
        if (!SM.cards || SM.cards.length == 0) {
            SM.Api("/cards/get_details", null, function(response) {
                SM.cards = response;
                if (callback)
                    callback()
            })
        } else if (callback)
            callback()
    },
    LoadItems: function(callback) {
        SM.Api("/players/item_details", null, function(response) {
            SM.items = response;
            if (callback)
                callback()
        })
    },
    GetItemDetails: function(id) {
        return SM.items.find(i=>i.id == id)
    },
    LoadCardsByUid: function(uids, callback) {
        SM.Api("/cards/find", {
            ids: uids
        }, function(cards) {
            cards.forEach(c=>{
                c.market_value = SM.CalcCardValue(c)
            }
            );
            if (callback)
                callback(cards)
        })
    },
    GetCardDetails: function(id) {
        return SM.cards.find(card=>{
            return card.id == id
        }
        )
    },
    GetCardLevelInfo: function(card) {
        var details = SM.GetCardDetails(card.card_detail_id || card.id);
        if (isNaN(card.xp))
            card.xp = (card.edition == 4 || details.tier) == 4 ? 1 : 0;
        if (card.edition == 4 || details.tier == 4) {
            let rates = card.gold ? SM.settings.combine_rates_gold[details.rarity - 1] : SM.settings.combine_rates[details.rarity - 1];
            let level = 0;
            for (let i = 0; i < rates.length; i++) {
                if (rates[i] > card.xp)
                    break;
                level++
            }
            if (card.xp == 0)
                level = 1;
            return {
                level: level,
                xp_to_next_level: card.xp - rates[level - 1],
                cards_to_next_level: card.xp - rates[level - 1],
                xp_needed: level >= rates.length ? -1 : rates[level] - rates[level - 1],
                cards_needed: level >= rates.length ? -1 : rates[level] - rates[level - 1]
            }
        }
        var levels = SM.settings.xp_levels[details.rarity - 1];
        var level = 0;
        for (var i = 0; i < levels.length; i++) {
            if (card.xp < levels[i]) {
                level = i + 1;
                break
            }
        }
        if (level == 0)
            level = levels.length + 1;
        var xp_to_next_level = level > levels.length ? card.xp - levels[levels.length - 1] : card.xp - (level == 1 ? 0 : levels[level - 2]);
        var xp_needed = level > levels.length ? -1 : level == 1 ? levels[level - 1] : levels[level - 1] - levels[level - 2];
        var xp_array = card.edition == 1 || card.edition == 3 || card.edition == 2 && details.id > 100 ? card.gold ? "beta_gold_xp" : "beta_xp" : card.gold ? "gold_xp" : "alpha_xp";
        var xp_per_card = SM.settings[xp_array][details.rarity - 1];
        var cards_needed = Math.ceil(xp_needed / xp_per_card);
        var cards_to_next_level = cards_needed - Math.ceil((xp_needed - xp_to_next_level) / xp_per_card);
        return {
            level: level,
            xp_to_next_level: xp_to_next_level,
            cards_to_next_level: cards_to_next_level,
            xp_needed: xp_needed,
            cards_needed: cards_needed
        }
    },
    GetCardStats: function(card) {
        if (card.card_detail_id == 199)
            console.log(card);
        var level = Math.min(card.max_level || 100, card.level || SM.GetCardLevelInfo(card).level);
        if (card.card_detail_id == 199)
            console.log(level);
        var details = SM.GetCardDetails(card.card_detail_id || card.id);
        var stats = details.stats;
        if (!stats)
            return {
                mana: 0,
                attack: 0,
                magic: 0,
                armor: 0,
                health: 0,
                speed: 0,
                abilities: [],
                level: 1
            };
        if (details.type == "Summoner")
            return Object.assign({
                abilities: [],
                level: level
            }, stats);
        var abilities = [];
        for (var i = 0; i < level; i++)
            stats.abilities[i].filter(a=>a != "").forEach(a=>abilities.push(a));
        return {
            mana: stats.mana[level - 1],
            attack: stats.attack[level - 1],
            ranged: stats.ranged ? stats.ranged[level - 1] : 0,
            magic: stats.magic[level - 1],
            armor: stats.armor[level - 1],
            health: stats.health[level - 1],
            speed: stats.speed[level - 1],
            abilities: abilities,
            level: level
        }
    },
    GetCardBCX: function(card) {
        var details = SM.GetCardDetails(card.card_detail_id);
        if (card.edition == 4 || details.tier == 4)
            return card.xp;
        var xp_property = card.edition == 0 || card.edition == 2 && card.card_detail_id < 100 ? card.gold ? "gold_xp" : "alpha_xp" : card.gold ? "beta_gold_xp" : "beta_xp";
        var bcx_xp = SM.settings[xp_property][details.rarity - 1];
        return Math.max(card.gold ? card.xp / bcx_xp : (card.xp + bcx_xp) / bcx_xp, 1)
    },
    CalcCardValue: function(card) {
        var bcx = SM.GetCardBCX(card);
        var price_per_bcx = 0;
        var market_item = SM._market_items_grouped.find(i=>i.card_detail_id == card.card_detail_id && i.edition == card.edition && i.gold == card.gold);
        if (market_item)
            price_per_bcx = market_item.low_price_bcx;
        return price_per_bcx * bcx
    },
    CalcCollectionValue: function(collection) {
        var total_value = 0;
        collection.forEach(details=>{
            if (!details.owned || details.owned.length == 0)
                return;
            details.owned.forEach(c=>{
                var market_value = SM.CalcCardValue(c);
                c.market_value = market_value;
                total_value += market_value
            }
            )
        }
        );
        return total_value
    },
    ShowCardDetails: function(detail_id, gold, edition, tab, refresh, external) {
        var card = SM.GetCardDetails(detail_id);
        if (["market", "rentals"].includes(tab) && SM.settings.soulbound_editions.includes(edition)) {
            tab = "cards"
        }
        SM.ShowHomeView("card_details", Object.assign({
            gold: gold,
            edition: edition,
            tab: tab,
            external: external
        }, card), {
            id: detail_id,
            gold: gold,
            edition: edition,
            tab: tab
        })
    },
    ShowCardInfo: function(uid, tab) {
        SM.LoadCardsByUid(uid, card_data=>SM.ShowHomeView("card_info", Object.assign({
            tab: tab
        }, card_data[0]), {
            id: card_data[0].uid,
            tab: tab
        }))
    },
    StartPurchase: function(type, quantity, currency, sendTo, merchant, data, purchase_origin) {
        console.log("purchase_origin:", purchase_origin);
        return new Promise((resolve,reject)=>{
            if (isNaN(quantity) || quantity <= 0)
                reject("Invalid quantity");
            var name = SM.Player ? SM.Player.name : "";
            snapyr.track("start_purchase", {
                type: type,
                quantity: quantity,
                currency: currency,
                merchant: merchant
            });
            if (["HIVE", "HBD", "DEC", "CREDITS"].includes(currency)) {
                SM.Api("/purchases/start", {
                    player: name,
                    type: type,
                    qty: quantity,
                    currency: currency,
                    orig_currency: currency,
                    merchant: merchant,
                    data: data,
                    purchase_origin: purchase_origin
                }, resolve)
            } else if (currency == "USD") {
                SM.Api("/purchases/start", {
                    player: sendTo ? sendTo : name,
                    type: type,
                    qty: quantity,
                    currency: "HIVE",
                    orig_currency: currency,
                    merchant: merchant,
                    data: data,
                    purchase_origin: purchase_origin
                }, function(response) {
                    if (response.error) {
                        reject(response);
                        return
                    }
                    resolve(response)
                })
            } else if (currency == "PROMO" || currency == "GIFT CARD") {
                SM.Api("/purchases/start", {
                    player: name,
                    type: type,
                    qty: quantity,
                    currency: "HIVE",
                    orig_currency: currency,
                    merchant: merchant,
                    data: data,
                    purchase_origin: purchase_origin
                }, resolve)
            } else {
                SM.ShowLoading();
                SM.ApiAsync("/purchases/start", {
                    player: name,
                    type: type,
                    qty: quantity,
                    currency: "HIVE",
                    orig_currency: currency,
                    merchant: merchant,
                    data: data,
                    purchase_origin: purchase_origin
                }).then(res=>{
                    SM.HideLoading();
                    if (res.error) {
                        reject(`There was an error initiating the purchase transaction: ${res.error}`)
                    }
                    resolve(res)
                }
                )
            }
        }
        )
    },
    RedeemPromoCode: function(purchase_id, code, callback) {
        SM.Api("/purchases/start_code", {
            code: code,
            purchase_id: purchase_id
        }, function(response) {
            if (response.error)
                alert("There was an error redeeming the promo code: " + JSON.stringify(response.error));
            if (callback)
                callback(response)
        })
    },
    _pack_data: null,
    OpenPack: function(edition) {
        SM._pack_data = null;
        SM._video_ended = false;
        SM.ShowLoading();
        SM.ShowPackOpenVideo(edition);
        SM.BroadcastCustomJson("sm_open_pack", "Open Pack", {
            edition: edition
        }, result=>{
            if (!result || result.error) {
                SM.PackOpenVideoEnded(true);
                alert("There was an error opening the pack: " + result.error);
                return
            }
            if (result && result.trx_info && result.trx_info.result) {
                var data = tryParse(result.trx_info.result);
                if (data && data.cards) {
                    SM._pack_data = {
                        cards: data.cards,
                        edition: edition,
                        potions: data.potions,
                        trx_id: result.trx_info.id,
                        block_num: result.trx_info.block_num,
                        block_id: result.trx_info.block_id,
                        prev_block_id: result.trx_info.prev_block_id
                    };
                    if (SM._video_ended) {
                        SM.HideLoading();
                        SM.ShowDialog("open_pack", SM._pack_data, null, null, true)
                    }
                } else {
                    SM.PackOpenVideoEnded(true);
                    alert("An unknown error occurred opening the pack.")
                }
            } else {
                SM.PackOpenVideoEnded(true);
                alert("An unknown error occurred opening the pack.")
            }
        }
        )
    },
    _video_ended: false,
    PackOpenVideoEnded: function(error) {
        $("#divVideo").remove();
        SM._video_ended = true;
        if (!error && SM._pack_data) {
            SM.HideLoading();
            SM.ShowDialog("open_pack", SM._pack_data, null, null, true)
        } else if (!error)
            SM.ShowLoading()
    },
    OpenAllPacks: function(edition, qty) {
        let pack_str = ["Alpha Packs", "Beta Packs", "Essence Orbs", "", "Untamed Packs", "AZMARE Dice", "Gladius Cases"];
        if (!confirm(`This will open ${qty || "all"} of your unopened ${pack_str[edition]} at once. Are you sure you want to continue?`))
            return;
        SM.ShowLoading();
        SM.BroadcastCustomJson("sm_open_all", "Open All Packs", {
            edition: edition,
            qty: qty
        }, result=>{
            SM.HideLoading();
            if (!result || result.error) {
                alert("There was an error opening your packs: " + result.error);
                return
            }
            if (result && result.trx_info && result.trx_info.result) {
                var trx_data = tryParse(result.trx_info.result);
                if (trx_data && trx_data.cards) {
                    var groups = _.groupBy(trx_data.cards, c=>c.card_detail_id + "#" + c.gold);
                    var data = _.map(groups, function(group) {
                        return {
                            card_detail_id: group[0].card_detail_id,
                            rarity: SM.GetCardDetails(group[0].card_detail_id).rarity,
                            gold: group[0].gold,
                            qty: group.length,
                            xp: group[0].xp
                        }
                    });
                    data = shuffle(data);
                    SM.ShowDialog("open_all_packs", {
                        edition: edition,
                        cards: data,
                        potions: trx_data.potions,
                        trx_id: result.trx_info.id,
                        block_num: result.trx_info.block_num,
                        block_id: result.trx_info.block_id,
                        prev_block_id: result.trx_info.prev_block_id,
                        pack_qty: trx_data.cards.length / 5
                    }, null, null, true)
                } else
                    alert("An unknown error occurred opening the packs.")
            } else
                alert("An unknown error occurred opening the packs.")
        }
        )
    },
    _payment_callback: null,
    SubmitPayment: function(payment_method, amount, currency, purchase_id, data) {
        if (payment_method != "steemkeychain" && payment_method != "dec")
            SM.ShowDialog("process_payment", {
                currency: currency
            }, null, null, "static");
        if (payment_method == "vessel") {
            vesselPayment(SM.settings.account, amount, currency, purchase_id)
        } else if (payment_method == "steemconnect") {
            scPayment(SM.settings.account, amount, currency, purchase_id)
        } else if (payment_method == "steemkeychain") {
            hive_keychain.requestTransfer(SM.Player ? SM.Player.name : null, SM.settings.account, amount.toFixed(3), purchase_id, currency, function(response) {
                if (response.success) {
                    SM.ShowDialog("process_payment", {
                        currency: currency
                    }, null, null, "static")
                } else
                    alert("Transaction cancelled.")
            })
        } else if (payment_method == "dec") {
            if (SM.GetBalance("DEC") < amount) {
                alert(`You do not have enough DEC to complete this purchase. If you have DEC on Steem Engine or Tron you must first transfer them into the game to use them for purchases.`);
                return
            }
            SM.ShowLoading();
            let p = new Promise(resolve=>SM.TransferToken("DEC", SM.settings.account, amount, {
                type: "pack_purchase",
                purchase_id: purchase_id
            }, r=>{
                if (!r || r.error)
                    resolve(r);
                else
                    SM._payment_callback = resolve
            }
            ));
            Promise.race([p, timeout(30 * 1e3)]).then(()=>SM.HideLoading())
        } else if (payment_method == "credits") {
            if (SM.GetBalance("CREDITS") < amount) {
                alert(`You do not have enough CREDITS to complete this purchase.`);
                return
            }
            SM.ShowLoading();
            let p = new Promise(resolve=>SM.TransferToken("DEC", SM.settings.account, amount, {
                type: "pack_purchase",
                purchase_id: purchase_id
            }, r=>resolve(r)));
            Promise.race([p, timeout(30 * 1e3)]).then(()=>SM.HideLoading())
        }
    },
    PaypalComplete: function(purchase_id, tx) {
        if (!localStorage.getItem("username")) {
            var new_account = localStorage.getItem("new_account");
            if (new_account)
                Messenger.Connect(new_account, null, true)
        }
        SM.ShowLoading();
        return new Promise((resolve,reject)=>{
            SM.Api("/purchases/paypal", {
                uid: purchase_id,
                tx: tx
            }, function(response) {
                if (response.error) {
                    reject(response.error)
                } else {
                    SM.ShowDialog("process_payment", {
                        currency: "STEEM"
                    }, null, null, "static");
                    resolve(response)
                }
            }, function() {
                SM.HideLoading()
            })
        }
        )
    },
    OnPurchaseComplete: function(purchase) {
        if (purchase.type == "starter_pack") {
            SM.HideDialog(true, function() {
                SM.Player.starter_pack_purchase = true;
                if (SM.Player.keys_available)
                    $("#nav_keys").show();
                SM.ShowShop();
                window.scrollTo(0, 0);
                if (SM.Player.use_proxy)
                    setTimeout(()=>SM.ShowDialog("choose_name", null, null, null, "static"), 1e3);
                else
                    setTimeout(()=>SM.ShowDialog("starter_set", null, null, null, "static"), 1e3);
                loadScript("https://platform.twitter.com/oct.js", ()=>{
                    twttr.conversion.trackPid("o4d35", {
                        tw_sale_amount: 10,
                        tw_order_quantity: 1
                    })
                }
                );
                WomplayTracking("purchased_spellbook")
            })
        } else if (purchase.type == "gift_card") {
            if (!purchase.data)
                response.data = JSON.parse(localStorage.getItem("sm_gift_card_data"));
            SM.ShowDialog("gift_card_purchased", purchase)
        } else if (purchase.type == "booster_pack") {
            SM.HideDialog(true, function() {
                SM.ShowOpenPacks();
                window.scrollTo(0, 0);
                if (purchase.data) {
                    let purchase_data = tryParse(purchase.data);
                    if (purchase_data.piggericks_code)
                        SM.ShowDialog("/misc/promotions/piggericks_code", {
                            code: purchase_data.piggericks_code
                        }, null, null, "static")
                }
                WomplayTracking("purchased_booster_pack")
            })
        } else if (purchase.type == "potion" && SM._potion_purchase_callback) {
            SM._potion_purchase_callback();
            SM._potion_purchase_callback = null
        } else {
            SM.HideDialog(true, ()=>SM.LoadBalances())
        }
        if (window.fbq)
            fbq("track", "Purchase", {
                value: parseFloat(purchase.amount_usd),
                currency: "USD"
            });
        snapyr.track("purchase_complete", {
            purchase_amount_usd: parseFloat(purchase.amount_usd),
            type: purchase.type
        });
        dataLayer.push({
            event: "purchase-complete",
            purchaseType: purchase.type,
            purchaseAmountUSD: parseFloat(purchase.amount_usd)
        })
    },
    MarketPurchase: function(market_ids, price, amount, currency, callback) {
        var id = SM.settings.test_mode ? SM.settings.prefix + "sm_market_purchase" : "sm_market_purchase";
        if (!["CREDITS", "DEC"].includes(currency))
            alert("Error: Invalid currency specified. Only DEC and CREDITS may be used for market purchases.");
        SM.ShowLoading();
        SM.BroadcastCustomJson(id, "Market Purchase", {
            items: market_ids,
            price: price + .01,
            currency: currency
        }, r=>{
            SM.HideLoading();
            if (callback)
                callback(r)
        }
        )
    },
    LoadSettings: function(callback) {
        SM.Api("/settings", null, function(response) {
            if (!response || !response.version) {
                if (SM.settings)
                    SM.settings.maintenance_mode = true;
                else
                    SM.settings = {
                        maintenance_mode: true
                    };
                if (callback)
                    callback(SM.settings);
                return
            }
            if (Config.version) {
                let config_version = parseInt(Config.version.replace(/\./g, ""));
                let settings_version = parseInt(response.version.replace(/\./g, ""));
                if (settings_version > config_version) {
                    if (confirm("New updates have been pushed, please click ok to refresh the page in your browser to get the latest changes."))
                        window.location.reload()
                }
            }
            SM.settings = response;
            if (!SM.current_brawl_cycle) {
                SM.current_brawl_cycle = SM.settings.brawl_cycle
            } else if (SM.settings.brawl_cycle.id !== SM.current_brawl_cycle.id && SM.settings.brawl_cycle.status === 1 || SM.settings.brawl_cycle.id === SM.current_brawl_cycle.id && SM.settings.brawl_cycle.status === 1 && SM.current_brawl_cycle.status === 0) {
                SM.current_brawl_cycle = SM.settings.brawl_cycle;
                if (SM.Player) {
                    SM.Api("/players/refresh_guild", {}, data=>{
                        if (data && !data.error) {
                            SM.Player.guild = data.guild;
                            if (SM.Player.guild && SM.Player.guild.tournament_id && SM.Player.guild.tournament_status === 0) {
                                SM.ShowNoty(SM.Player.guild.tournament_id + "-in-progress", "brawl_in_progress", {
                                    id: SM.Player.guild.tournament_id,
                                    type: "prep_stage_start",
                                    expiration_block_num: SM.GetCurrentBlockNum() + 20
                                }, true);
                                sendNotification("Get Ready to Brawl!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "Fray selection is open for the next Brawl! Go fill one to help your guild.", ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl"))
                            }
                        }
                    }
                    )
                }
            }
            if (SM.settings.rpc_nodes && Array.isArray(SM.settings.rpc_nodes) && SM.settings.rpc_nodes.length > 0) {
                Config.rpc_nodes = SM.settings.rpc_nodes.filter(n=>n.startsWith("https://"));
                let rpc_index = 0;
                if (Config.rpc_nodes.length > 1)
                    rpc_index = Math.floor(Math.random() * 2);
                steem.api.setOptions({
                    transport: "http",
                    uri: Config.rpc_nodes[rpc_index],
                    url: Config.rpc_nodes[rpc_index],
                    useAppbaseApi: true
                });
                console.log(`Set node to ${Config.rpc_nodes[rpc_index]}`)
            }
            if (callback)
                callback(SM.settings)
        })
    },
    GiftPacks: function(to, qty, edition, memo, callback) {
        var obj = {
            to: to,
            qty: qty,
            edition: edition,
            memo: memo
        };
        SM.BroadcastCustomJson("sm_gift_packs", "Gift Packs", obj, callback)
    },
    CombineCards: function(card_detail_id, gold, card_ids, callback) {
        var obj = {
            cards: card_ids
        };
        var details = SM.GetCardDetails(card_detail_id);
        SM.BroadcastCustomJson("sm_combine_cards", "Combine Cards", obj, result=>{
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                SM.Api("/cards/collection_by_card", {
                    player: SM.Player.name,
                    card_detail_id: card_detail_id,
                    gold: gold
                }, response=>{
                    details.owned = response.cards.sort((a,b)=>b.xp - a.xp);
                    if (callback)
                        callback(details)
                }
                )
            } else if (callback)
                callback(details)
        }
        )
    },
    CombineAll: function(card_detail_id, gold, edition, callback) {
        var obj = {
            card_detail_id: card_detail_id,
            gold: gold,
            edition: edition
        };
        var details = SM.GetCardDetails(card_detail_id);
        SM.BroadcastCustomJson("sm_combine_all", "Combine Cards", obj, result=>{
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                SM.Api("/cards/collection_by_card", {
                    player: SM.Player.name,
                    card_detail_id: card_detail_id,
                    gold: gold
                }, response=>{
                    details.owned = response.cards.sort((a,b)=>b.xp - a.xp);
                    if (callback)
                        callback(details)
                }
                )
            } else if (callback)
                callback(details)
        }
        )
    },
    CombineAllArray: function(card_detail_list, callback) {
        var obj = {
            cards: card_detail_list
        };
        SM.BroadcastCustomJson("sm_combine_all", "Combine Cards", obj, result=>{
            if (callback)
                callback(result)
        }
        )
    },
    ConvertToDEC: function(card_ids, callback) {
        var obj = {
            cards: card_ids
        };
        SM.BroadcastCustomJson("sm_burn_cards", "Convert to DEC", obj, result=>{
            if (callback)
                callback(result)
        }
        )
    },
    LinkExternalWallet: function(type, address, callback) {
        SM.BroadcastCustomJson("sm_add_wallet", "Link Wallet", {
            type: type,
            address: address
        }, r=>{
            if (callback)
                callback(r)
        }
        )
    },
    GiftCards: function(card_ids, recipient, callback) {
        var obj = {
            to: recipient,
            cards: card_ids
        };
        SM.BroadcastCustomJson("sm_gift_cards", "Gift Cards", obj, result=>{
            if (callback)
                callback(result)
        }
        )
    },
    TransferItems: function(items, recipient, callback) {
        var obj = {
            to: recipient,
            items: items
        };
        SM.BroadcastCustomJson("sm_transfer_items", "Transfer Items", obj, result=>{
            if (callback)
                callback(result)
        }
        )
    },
    ReturnCardsFromExternalBlockchain: function(blockchainName, externalTokenIds) {
        return new Promise(async(resolve,reject)=>{
            blockchainName = blockchainName.toLowerCase();
            if (blockchainName === "ethereum") {
                if (window.web3) {
                    try {
                        let address = await WalletUtils.web3connect();
                        const contract = new window.web3.eth.Contract(JSON.parse(SM.settings.ethereum.contracts.cards.abi.result),SM.settings.ethereum.contracts.cards.address);
                        externalTokenIds.forEach(id=>{
                            contract.methods.lockCard(id, SM.Player.name).send({
                                from: address
                            }).on("confirmation", (confirmationNumber,receipt)=>resolve(receipt)).on("error", (error,receipt)=>reject(error))
                        }
                        )
                    } catch (err) {
                        console.log(err);
                        throw err
                    }
                }
            } else if (blockchainName === "wax") {
                loadScript(Config.asset_location + "scripts/libraries/waxjs/0.0.14/waxjs.js", async()=>{
                    const wax = new waxjs.WaxJS("https://wax.greymass.com",null,null,false);
                    try {
                        const isAutoLoginAvailable = await wax.isAutoLoginAvailable();
                        if (!isAutoLoginAvailable) {
                            await wax.login()
                        }
                        await wax.api.transact({
                            actions: [{
                                account: SM.settings.wax.external.atomicassets.account,
                                name: "transfer",
                                authorization: [{
                                    actor: wax.userAccount,
                                    permission: "active"
                                }],
                                data: {
                                    from: wax.userAccount,
                                    to: SM.settings.wax.external.token.account,
                                    asset_ids: externalTokenIds,
                                    memo: SM.Player.name
                                }
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200
                        })
                    } catch (err) {
                        console.log("WAX error: ", err);
                        throw err
                    }
                }
                )
            } else {
                reject(new Error(`No support for ${blockchainName}`))
            }
        }
        )
    },
    ReturnDecFromExternalBlockchain: function(blockchainName, qty) {
        return new Promise(async(resolve,reject)=>{
            if (blockchainName.toLowerCase() === "ethereum") {
                if (window.web3) {
                    try {
                        let address = await WalletUtils.web3connect();
                        const contract = new window.web3.eth.Contract(JSON.parse(SM.settings.ethereum.contracts.crystals.abi.result),SM.settings.ethereum.contracts.crystals.address);
                        contract.methods.lock(SM.Player.name, qty * 1e3).send({
                            from: address
                        }).on("confirmation", (confirmationNumber,receipt)=>resolve(receipt)).on("error", (error,receipt)=>reject(error))
                    } catch (err) {
                        throw err
                    }
                } else {
                    reject(new Error(`No support for ${blockchainName}`))
                }
            } else if (blockchainName === "wax") {
                loadScript(Config.asset_location + "scripts/libraries/waxjs/0.0.14/waxjs.js", async()=>{
                    const wax = new waxjs.WaxJS("https://wax.greymass.com",null,null,false);
                    try {
                        if (!await wax.isAutoLoginAvailable()) {
                            await wax.login()
                        }
                        await wax.api.transact({
                            actions: [{
                                account: SM.settings.wax.external.token.account,
                                name: "transfer",
                                authorization: [{
                                    actor: wax.userAccount,
                                    permission: "active"
                                }],
                                data: {
                                    from: wax.userAccount,
                                    to: SM.settings.wax.external.token.account,
                                    quantity: `${qty.toFixed(3)} DEC`,
                                    memo: SM.Player.name
                                }
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 1200
                        })
                    } catch (err) {
                        console.log("WAX error: ", err)
                    }
                }
                )
            } else {
                reject(new Error(`No support for ${blockchainName}`))
            }
        }
        )
    },
    TransferToken: function(symbol, to, qty, data, callback) {
        var obj = {
            to: to,
            qty: qty,
            token: symbol
        };
        if (data)
            obj = Object.assign(obj, data);
        SM.BroadcastCustomJson("sm_token_transfer", `Transfer ${symbol}`, obj, result=>{
            if (callback)
                callback(result)
        }
        )
    },
    _transactions: {},
    TrxLookup: function(trx_id, details, callback, retries, suppressError, timeout) {
        if (SM._transactions[trx_id]) {
            if (SM._transactions[trx_id].status == "complete") {
                if (callback)
                    callback(SM._transactions[trx_id].data);
                delete SM._transactions[trx_id]
            }
            return
        }
        if (timeout == null || timeout == undefined)
            timeout = 60;
        SM._transactions[trx_id] = {
            details: details,
            callback: callback,
            suppressError: suppressError
        };
        if (timeout > 0) {
            SM._transactions[trx_id].timeout = setTimeout(()=>{
                if (SM._transactions[trx_id] && SM._transactions[trx_id].status != "complete") {
                    alert("Your transaction could not be found. This may be an issue with the game server. Please try refreshing the site to see if the transaction went through.");
                    SM.HideLoading();
                    delete SM._transactions[trx_id];
                    if (callback)
                        callback(null)
                }
            }
            , timeout * 1e3)
        }
    },
    CheckAccount(name, ok, bad, callback) {
        SM.Api("/players/exists", {
            name: name
        }, result=>{
            if (result && result.exists) {
                if (ok)
                    ok.show();
                if (bad)
                    bad.hide();
                if (callback)
                    callback(true, result)
            } else {
                if (ok)
                    ok.hide();
                if (bad)
                    bad.show();
                if (callback)
                    callback(false, result)
            }
        }
        )
    },
    SellCards: function(card_ids, price, callback) {
        var obj = [{
            cards: card_ids,
            currency: "USD",
            price: price,
            fee_pct: SM.settings.market_fee
        }];
        SM.BroadcastCustomJson("sm_sell_cards", "Steem Monsters Card Sale", obj, callback)
    },
    CancelSellCards: function(market_id, callback) {
        var obj = {
            trx_ids: [market_id]
        };
        SM.BroadcastCustomJson("sm_cancel_sell", "Steem Monsters Cancel Sale", obj, callback)
    },
    CardDetailString: function(card) {
        var rarity = card.rarity == 4 ? "Legendary" : card.rarity == 3 ? "Epic" : card.rarity == 2 ? "Rare" : "Common";
        var splinter = card.color == "Red" ? "Fire" : card.color == "Blue" ? "Water" : card.color == "Green" ? "Earth" : card.color == "Black" ? "Death" : card.color == "White" ? "Life" : card.color == "Gray" ? "Neutral" : "Dragon";
        var str = '<img class="stats-type-img" src="https://d36mxiodymuqjm.cloudfront.net/website/icons/icon-rarity-' + rarity.toLowerCase() + '.svg" data-toggle="tooltip" data-placement="bottom" title="' + rarity + '"/>';
        str += '<img class="stats-type-img" src="https://d36mxiodymuqjm.cloudfront.net/website/icons/icon-element-' + splinter.toLowerCase() + '.svg" data-toggle="tooltip" data-placement="bottom" title="' + splinter + '"/>';
        str += '<img class="stats-type-img" src="https://d36mxiodymuqjm.cloudfront.net/website/icons/icon-type-' + card.type.toLowerCase() + '.svg" data-toggle="tooltip" data-placement="bottom" title="' + card.type + '"/>';
        return str
    },
    ShowCreateTeam: function(battle_queue, extendedData={}) {
        if (!battle_queue)
            return;
        SM.ShowLoading();
        SM.LoadCollection(SM.Player.name, false, function(collection) {
            SM.collection_filters.types = ["Summoner"];
            SM.ShowHomeView("create_team2", Object.assign(collection, battle_queue, {
                league: Math.max(SM.Player.league, battle_queue.opponent.league)
            }, extendedData));
            SM.HideLoading()
        })
    },
    OutstandingMatch: async function(match) {
        if (match && match.id) {
            SM.in_battle = true;
            SM._currentBattle = match;
            if (match.status == 0) {
                SM.ShowDialog("find_opponent", {
                    match_type: match.match_type,
                    opponent: match.opponent_player,
                    settings: match.settings ? JSON.parse(match.settings) : null
                }, null, function() {
                    SM.ExitBattlePopup()
                }, "static")
            } else if (match.status == 1 && match.team_hash) {
                SM.ShowDialog("wait_for_opponent", {
                    queue_trx: match.id,
                    submit_expiration_date: match.submit_expiration_date,
                    team: match.team
                }, null, function() {
                    SM.ExitBattlePopup()
                }, "static");
                SM.CheckBattleStatus(match.id)
            } else if (match.status == 1 || match.status == 7) {
                if (match.status == 7) {
                    if (match.tournament_sub_format === "brawl") {
                        SM.current_tournament = {
                            id: match.tournament_id,
                            format: "swiss",
                            sub_format: "brawl",
                            guild_id: SM.Player.guild ? SM.Player.guild.id : null
                        };
                        var r = await SM.ApiAsync("/tournaments/battles", {
                            id: match.tournament_id,
                            round: 1,
                            player: SM.Player.name,
                            reverse: 0
                        });
                        if (r && !r.error) {
                            match.battles_remaining = r.battles_remaining
                        }
                    } else {
                        var r = await SM.ApiAsync("/tournaments/find", {
                            id: match.tournament_id,
                            player_limit: 100
                        });
                        if (r && !r.error) {
                            match.battles_remaining = r.matchup.battles_remaining
                        }
                    }
                }
                SM.ShowEnemyFound(match)
            }
        }
        if (match && match.tournament_id) {
            if (window.location.search.indexOf("?p=battle&") < 0) {
                if (match.tournament_sub_format === "brawl") {
                    if (SM.Player.guild) {
                        SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl")
                    }
                } else {
                    SM.ShowTournament(match.tournament_id)
                }
            }
        } else if (match && match.tournament_checkin_id)
            SM.ShowNoty(match.tournament_checkin_id, "tournament_checkin", {
                id: match.tournament_checkin_id,
                name: match.tournament_checkin_name
            }, false)
    },
    FindMatch: function(match_type, opponent, settings) {
        if (!SM.Player) {
            SM.ShowLogin();
            return
        }
        SM.in_battle = true;
        SM.ShowDialog("find_opponent", {
            match_type: match_type,
            opponent: opponent,
            settings: settings
        }, null, function() {
            SM.ExitBattlePopup()
        }, "static");
        snapyr.track("find_match", {
            match_type: match_type,
            settings: settings
        });
        SM.BroadcastCustomJson("sm_find_match", "Steem Monsters Find Match", {
            match_type: match_type,
            opponent: opponent,
            settings: settings
        }, function(result) {
            if (result && !result.error && result.trx_info && result.trx_info.success) {} else {
                if (result && result.error && result.error.indexOf("Please refresh the page to resume") >= 0)
                    window.location.reload();
                else {
                    SM.HideDialog();
                    SM.in_battle = false
                }
            }
        })
    },
    ShowEnemyFound: function(battle_queue) {
        SM.ShowLoading();
        SM.Api("/players/details", {
            name: battle_queue.opponent_player,
            teams: true
        }, function(response) {
            let settings = typeof battle_queue.settings === "string" ? tryParse(battle_queue.settings) : battle_queue.settings;
            if (settings && settings.home && settings.away) {
                battle_queue.settings = settings;
                SM.LoadCards(()=>{
                    SM.HighlightMenuItem("guilds");
                    SM.ShowHomeView("brawl_enemy_found", Object.assign(battle_queue, {
                        opponent: response
                    }))
                }
                )
            } else {
                SM.ShowDialog("enemy_found", Object.assign(battle_queue, {
                    opponent: response
                }), null, null, "static")
            }
        }, ()=>SM.HideLoading())
    },
    _currentBattle: null,
    SubmitTeam: async function(queue_trx, submit_expiration_date, summoner, monsters, match_type, extra_data) {
        SM.ShowLoading();
        var secret = generatePassword(10);
        var team_hash = md5(summoner + "," + monsters.join() + "," + secret);
        var team = {
            summoner: summoner,
            monsters: monsters,
            secret: secret
        };
        var is_swiss = extra_data && extra_data.format && extra_data.format === "swiss";
        var data = {
            trx_id: queue_trx,
            team_hash: team_hash
        };
        var submit_and_reveal = (match_type == "Practice" || match_type == "Ranked") && !SM.Player.settings.submit_hashed_team;
        if (match_type === "Tournament" && is_swiss) {
            var params = {
                trx_id: queue_trx,
                summoner: summoner,
                monsters: monsters.join(),
                secret: secret
            };
            var team_result = await SM.ApiAsync("/battle/send_team", params);
            if (!team_result || team_result.error) {
                SM.HideLoading();
                alert("There was an error submitting your team, please try again. Error: " + (team_result ? team_result.error : "unknown"));
                return
            }
        } else if (submit_and_reveal) {
            data.summoner = team.summoner;
            data.monsters = team.monsters;
            data.secret = team.secret
        }
        SM.BroadcastCustomJson("sm_submit_team", "Steem Monsters Submit Team", data, function(result) {
            SM.HideLoading();
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                if (is_swiss) {
                    if (SM._currentBattle.opponent_team_hash) {
                        if (SM.CurrentView.view != "battle")
                            SM.ShowDialog("wait_for_opponent", {
                                queue_trx: queue_trx,
                                submit_expiration_date: submit_expiration_date,
                                team: team,
                                is_swiss: is_swiss
                            }, null, function() {
                                SM.ExitBattlePopup()
                            }, "static")
                    } else {
                        SM._currentBattle = null;
                        SM.in_battle = false;
                        SM.ExitBattlePopup();
                        var notificationText = extra_data.battles_remaining > 1 ? "Your team has taken the field! Check back later for the results; you may move on to your next battle." : "All teams have entered the field of battle. Will you attain ultimate victory or be cast aside on the dust heap of tournament history? Time will soon tell.";
                        new Noty({
                            type: "success",
                            theme: "sm",
                            timeout: 3e4,
                            text: notificationText
                        }).show()
                    }
                } else {
                    if (SM.CurrentView.view != "battle")
                        SM.ShowDialog("wait_for_opponent", {
                            queue_trx: queue_trx,
                            submit_expiration_date: submit_expiration_date,
                            team: team
                        }, null, function() {
                            SM.ExitBattlePopup()
                        }, "static");
                    if (!submit_and_reveal && SM._currentBattle.opponent_team_hash)
                        SM.RevealTeam(queue_trx, team)
                }
            } else {
                SM.HideDialog();
                if (result)
                    alert("An error has occurred submitting your team - Error: " + result.error);
                else if (!is_swiss) {
                    SM.RevealTeam(queue_trx, team)
                }
            }
        }, 2);
        if (!submit_and_reveal && !is_swiss)
            setTimeout(()=>SM.CheckBattleStatus(queue_trx, team), 10 * 1e3);
        localStorage.setItem("sm_submit_team", JSON.stringify(team))
    },
    CheckBattleStatus: function(queue_trx, team) {
        SM.Api("/battle/status", {
            id: queue_trx
        }, result=>{
            if (!result || result.status >= 2 || result.reveal_tx)
                return;
            if (result.team_hash && result.opponent_team_hash) {
                SM.RevealTeam(queue_trx, team)
            } else
                setTimeout(()=>SM.CheckBattleStatus(queue_trx, team), 10 * 1e3)
        }
        )
    },
    _lastReveal: null,
    RevealTeam: function(queue_trx, team, callback) {
        if (!team)
            team = JSON.parse(localStorage.getItem("sm_submit_team"));
        SM._lastReveal = queue_trx;
        SM.BroadcastCustomJson("sm_team_reveal", "Steem Monsters Team Reveal", {
            trx_id: queue_trx,
            summoner: team.summoner,
            monsters: team.monsters,
            secret: team.secret
        }, function(result) {
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                if (callback)
                    callback(true)
            } else if (result.error && !result.error.startsWith("Team has already been revealed")) {
                SM.HideDialog();
                if (callback)
                    callback(false);
                if (result.error != "ignored")
                    alert("An error has occurred revealing your team - Error: " + result.error)
            }
        }, 1, true)
    },
    RequestDelegation: function(id, title, data, callback) {
        SM.LogEvent("delegation_request", {
            operation: id
        });
        SM.Api("/players/delegation", null, function(result) {
            if (result.success) {
                setTimeout(()=>SM.BroadcastCustomJson(id, title, data, callback), 1e3)
            } else {
                SM.LogEvent("delegation_request_failed", {
                    operation: id,
                    error: result.error
                });
                alert("Oops, it looks like you don't have enough Resource Credits to transact on the Hive blockchain. Please contact us on Discord for help! Error: " + result.error);
                if (callback)
                    callback(result)
            }
        })
    },
    ShowBattleScreen: function(battle_result) {
        if (battle_result) {
            battle_result.details = JSON.parse(battle_result.details);
            if (!battle_result.inactive)
                battle_result.inactive = [];
            SM.ShowHomeView("battle", battle_result, {
                id: battle_result.battle_queue_id_1
            })
        } else {
            $.get("/result.json", function(data) {
                data.details = JSON.parse(data.details);
                if (!data.inactive)
                    data.inactive = [];
                SM.ShowHomeView("battle", data)
            })
        }
    },
    GetCardDistribution: function(card_detail_id, gold, edition) {
        if (!gold)
            gold = false;
        let dist_details = SM.GetCardDetails(card_detail_id).distribution;
        var dist = dist_details.find(c=>c.gold == gold && c.edition == edition);
        if (!dist)
            return {
                card_detail_id: card_detail_id,
                gold: gold,
                num_cards: "0",
                total_xp: "0"
            };
        else
            return dist
    },
    LoadBattle(id, force_record_watched) {
        SM.Api("/battle/result", {
            id: id
        }, function(result) {
            SM.HideLoading();
            if (JSON.parse(result.details).type == "Surrender") {
                if (result.settings)
                    result.settings = JSON.parse(result.settings);
                if (result.dec_info)
                    result.dec_info = JSON.parse(result.dec_info);
                if ($("#brawl_enemy_found_page").length > 0) {
                    if (SM.Player && SM.Player.guild) {
                        SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl")
                    } else {
                        SM.ShowBattleHistory()
                    }
                }
                SM.ShowDialog("battle_result", result)
            } else {
                if (result.match_type === "Tournament" && result.tournament && result.tournament.sub_format === "brawl" && (result.tournament.status === 1 || force_record_watched) && SM.Player && (SM.Player.name === result.player_1 || SM.Player.name === result.player_2)) {
                    if (!SM.current_watched) {
                        SM.LoadCurrentWatched(SM.Player.name, result.tournament.id)
                    }
                    SM.MarkAsWatched(result.battle_queue_id_1);
                    SM.MarkAsWatched(result.battle_queue_id_2)
                }
                SM.HideDialog(true);
                SM.ShowBattleScreen(result)
            }
        })
    },
    LoadCurrentWatched(player_name, tournament_id) {
        SM.current_watched = localStorage.getItem(`watched_brawl_battles::${player_name}`);
        if (SM.current_watched) {
            SM.current_watched = tryParse(SM.current_watched);
            if (SM.current_watched && SM.current_watched.tournament_id !== tournament_id) {
                localStorage.removeItem(`watched_brawl_battles::${player_name}`);
                SM.current_watched = null
            }
        }
        if (!SM.current_watched) {
            SM.current_watched = {
                tournament_id: tournament_id,
                player: player_name,
                battle_list: []
            }
        }
    },
    MarkAsWatched(id) {
        if (!SM.current_watched) {
            return
        }
        let battle_record = SM.current_watched.battle_list.indexOf(id);
        if (battle_record < 0) {
            SM.current_watched.battle_list.push(id);
            localStorage.setItem(`watched_brawl_battles::${SM.current_watched.player}`, JSON.stringify(SM.current_watched))
        }
    },
    ExitBattlePopup() {
        if (SM.current_tournament) {
            if (SM.current_tournament.sub_format === "brawl") {
                if (SM.current_tournament.guild_id) {
                    SM.Guilds.ShowGuild(SM.current_tournament.guild_id, "brawl")
                } else {
                    SM.ShowBattleHistory()
                }
            } else {
                SM.HighlightMenuItem("tournament");
                SM.ShowTournament(SM.current_tournament.id)
            }
        } else
            SM.ShowBattleHistory()
    },
    ShowBattleHistory(player, isNew) {
        if (player && player.length > 17)
            player = null;
        if (!player && SM.Player)
            player = SM.Player.name;
        SM.HighlightMenuItem("battle");
        SM.ShowHomeView("battle_history", {
            player: player,
            isNew: isNew
        })
    },
    CancelMatch(callback) {
        SM.BroadcastCustomJson("sm_cancel_match", "Steem Monsters Cancel Match", {}, callback)
    },
    Surrender(id, callback) {
        SM.BroadcastCustomJson("sm_surrender", "Steem Monsters Surrender Match", {
            battle_queue_id: id
        }, callback)
    },
    GetImageUrl(card, is_battle) {
        var details = SM.GetCardDetails(card.card_detail_id);
        if (!details)
            return null;
        let urls = ["cards_v2.2", "cards_beta", "cards_v2.2", "cards_beta", "cards_untamed", "cards_untamed", "cards_gladiator"];
        let folder_url = urls[card.edition];
        let editions = ["alpha", "beta", "alpha", "beta", "untamed", "untamed", "gladiator"];
        if (is_battle)
            folder_url = `cards_battle_${editions[card.edition]}`;
        return `${Config.card_image_url}/${folder_url}/` + (card.skin ? card.skin + "/" : "") + encodeURIComponent(details.name).replace(/'/g, "%27") + (card.gold ? "_gold" : "") + (card.skin == "ascension" ? ".gif" : ".png")
    },
    GetAvatarData(player) {
        const league_group = player ? SM.settings.leagues[player.league || 0].group : "Novice";
        return {
            frame: `https://d36mxiodymuqjm.cloudfront.net/website/icons/avatars/avatar-frame_${league_group.toLowerCase()}.png`,
            icon: `https://d36mxiodymuqjm.cloudfront.net/website/icons/avatars/avatar_${player && player.avatar_id ? player.avatar_id : 0}.png`
        }
    },
    ShowLeagueInfo(league_num) {
        SM.ShowDialog("leagues", {
            number: league_num
        })
    },
    ShowQuestDetails(quest) {
        SM.ShowDialog("quest_details", {
            quest: quest
        })
    },
    Test(winner) {
        var result_obj = {
            id: "12345",
            match_type: "Ranked",
            mana_cap: 20,
            current_streak: 2,
            winner: winner,
            player_1: "yabapmatt",
            player_2: "aggroed",
            player_1_rating_initial: 150,
            player_2_rating_initial: 150,
            player_1_rating_final: 180,
            player_2_rating_final: 120,
            player_1_summoner: {
                uid: "Alric Stormbringer-oliverschmid",
                xp: 1e4,
                gold: false,
                card_detail_id: 16,
                level: 8,
                edition: 1
            },
            player_2_summoner: {
                uid: "Tyrus Paladium-rondras",
                xp: 1e4,
                gold: false,
                card_detail_id: 38,
                level: 8,
                edition: 1
            }
        };
        SM.ShowDialog("battle_result", result_obj)
    },
    GetMaxMonsterLevel(league, summoner, monster_rarity, monster_edition, gladiator_cap) {
        if (league == 0)
            return 1;
        let final_monster_edition = parseInt(monster_edition);
        let rating_level = final_monster_edition === 6 ? Math.min(SM.settings.leagues[league].level, gladiator_cap) : SM.settings.leagues[league].level;
        let summoner_details = SM.GetCardDetails(summoner.card_detail_id);
        let summoner_rarity = summoner_details.rarity;
        let summoner_level = summoner.level || SM.GetCardLevelInfo(summoner).level;
        let summoner_max = 10 - (summoner_rarity - 1) * 2;
        let monster_max = 10 - (monster_rarity - 1) * 2;
        summoner_level = Math.min(summoner_level, Math.max(Math.round(summoner_max / 4 * rating_level), 1));
        return Math.max(Math.round(monster_max / summoner_max * summoner_level), 1)
    },
    GetRuleset(ruleset) {
        return SM.settings.battles.rulesets.find(r=>r.name == ruleset) || {}
    },
    ClaimRewards(type, data, callback) {
        var obj = Object.assign({
            type: type
        }, data);
        SM.BroadcastCustomJson("sm_claim_reward", "Steem Monsters Reward Claim", obj, callback)
    },
    StartDailyQuest(callback) {
        SM.BroadcastCustomJson("sm_start_quest", "Start Quest", {
            type: "daily"
        }, callback)
    },
    RefreshDailyQuest(callback) {
        SM.BroadcastCustomJson("sm_refresh_quest", "Steem Monsters Refresh Quest", {
            type: "daily"
        }, callback)
    },
    _active_auth_tx_callbacks: {},
    BroadcastCustomJson: async function(id, title, data, callback, retries, supressErrors) {
        if (SM.settings.test_mode && !id.startsWith(SM.settings.prefix))
            id = SM.settings.prefix + id;
        let active_auth = SM.Player.require_active_auth && SM.settings.active_auth_ops.includes(id.slice(id.indexOf("sm_") + 3));
        data.app = "steemmonsters/" + SM.settings.version;
        data.n = generatePassword(10);
        if (SM.settings.test_mode)
            data.app = SM.settings.prefix + data.app;
        let bcast_url = Config.tx_broadcast_urls[Math.floor(Math.random() * Config.tx_broadcast_urls.length)];
        let tx = {
            operations: [["custom_json", {
                required_auths: active_auth ? [SM.Player.name] : [],
                required_posting_auths: active_auth ? [] : [SM.Player.name],
                id: id,
                json: JSON.stringify(data)
            }]]
        };
        if (SM.Player.use_proxy) {
            let op_name = removeTxPrefix(id);
            if (SM.settings.api_ops.includes(op_name)) {
                jQuery.post(`${Config.api_url}/battle/battle_tx`, {
                    signed_tx: JSON.stringify(tx)
                }, response=>{
                    if (response && response.id)
                        SM.TrxLookup(response.id, null, callback, 10, supressErrors);
                    else
                        alert(`Error sending transaction: ${response ? response.error : "Unknown error"}`)
                }
                ).fail(err=>alert(`Error sending transaction: ${err && err.message ? err.message : err}`));
                return
            }
            jQuery.post(`${bcast_url}/proxy`, {
                player: SM.Player.name,
                access_token: SM.Player.token,
                id: id,
                json: data
            }, response=>{
                if (response && response.id)
                    SM.TrxLookup(response.id, null, callback, 10, supressErrors);
                else
                    alert(`Error sending transaction: ${response ? response.error : "Unknown error"}`)
            }
            );
            return
        }
        if (!active_auth || active_auth && window.hive_keychain) {
            try {
                let response = await SM.ServerBroadcastTx(tx, active_auth);
                if (response && response.id)
                    return SM.TrxLookup(response.id, null, callback, 10, supressErrors);
                if (response.error == "user_cancel")
                    alert("Transaction was cancelled.");
                else if (response.error && JSON.stringify(response.error).indexOf("Please wait to transact") >= 0) {
                    SM.RequestDelegation(id, title, data, callback)
                } else {
                    setTimeout(()=>SM.BroadcastCustomJsonLocal(id, title, data, callback, 2, supressErrors), 3e3)
                }
            } catch (err) {
                console.log(err);
                SM.BroadcastCustomJsonLocal(id, title, data, callback, 2, supressErrors)
            }
        } else {
            let callback_id = `cb_${generatePassword(10)}`;
            SM._active_auth_tx_callbacks[callback_id] = callback;
            SM.ShowDialog("active_auth", {
                id: id,
                title: title,
                data: data,
                callback_id: callback_id
            })
        }
    },
    BroadcastCustomJsonLocal: function(id, title, data, callback, retries, supressErrors) {
        if (SM.settings.test_mode && !id.startsWith(SM.settings.prefix))
            id = SM.settings.prefix + id;
        let active_auth = SM.Player.require_active_auth && SM.settings.active_auth_ops.includes(id.slice(id.indexOf("sm_") + 3));
        data.app = "splinterlands/" + Config.version;
        if (SM.settings.test_mode)
            data.app = SM.settings.prefix + data.app;
        if (isNaN(retries))
            retries = 2;
        let bcast_url = Config.tx_broadcast_urls[Math.floor(Math.random() * Config.tx_broadcast_urls.length)];
        if (SM.Player.use_proxy) {
            jQuery.post(`${bcast_url}/proxy`, {
                player: SM.Player.name,
                access_token: SM.Player.token,
                id: id,
                json: data
            }, response=>{
                if (response && response.id)
                    SM.TrxLookup(response.id, null, callback, 10, supressErrors);
                else
                    alert(`Error sending transaction: ${response ? response.error : "Unknown error"}`)
            }
            );
            return
        }
        if (SM._use_keychain || active_auth && window.hive_keychain) {
            let rpc_node = Config.rpc_nodes[SM._rpc_index % Config.rpc_nodes.length];
            hive_keychain.requestCustomJson(SM.Player.name, id, active_auth ? "Active" : "Posting", JSON.stringify(data), title, function(response) {
                if (response.success) {
                    SM.TrxLookup(response.result.id, null, callback, 10, supressErrors)
                } else {
                    if (response.error == "user_cancel")
                        alert("Transaction was cancelled.");
                    else if (response.error && JSON.stringify(response.error).indexOf("Please wait to transact") >= 0) {
                        SM.RequestDelegation(id, title, data, callback, retries);
                        return
                    } else if (response.error != "ignored" && retries > 0) {
                        rpc_node = Config.rpc_nodes[++SM._rpc_index % Config.rpc_nodes.length];
                        steem.api.setOptions({
                            transport: "http",
                            uri: rpc_node,
                            url: rpc_node,
                            useAppbaseApi: true
                        });
                        console.log(`SWITCHED TO NEW RPC NODE: ${rpc_node}`);
                        console.log("Retrying failed keychain transaction...");
                        setTimeout(()=>SM.BroadcastCustomJsonLocal(id, title, data, callback, retries - 1, supressErrors), 3e3);
                        return
                    } else if (!supressErrors) {
                        alert(`There was an error publishing this transaction to the Hive blockchain. Please check to see if it went through or try again in a few minutes. Error: ${response && response.error ? response.error : "Unknown"}`)
                    }
                    SM.LogEvent("custom_json_failed", {
                        response: JSON.stringify(response)
                    });
                    if (callback)
                        callback(response)
                }
            }, rpc_node)
        } else {
            if (active_auth) {
                let callback_id = `cb_${generatePassword(10)}`;
                SM._active_auth_tx_callbacks[callback_id] = callback;
                SM.ShowDialog("active_auth", {
                    id: id,
                    title: title,
                    data: data,
                    callback_id: callback_id
                });
                return
            }
            steem.broadcast.customJson(localStorage.getItem("key"), [], [SM.Player.name], id, JSON.stringify(data), function(err, result) {
                if (result && !err) {
                    SM.TrxLookup(result.id, null, callback, 10, supressErrors)
                } else {
                    if (err && JSON.stringify(err).indexOf("Please wait to transact") >= 0) {
                        SM.RequestDelegation(id, title, data, callback, retries);
                        return
                    } else if (retries > 0) {
                        let rpc_node = Config.rpc_nodes[++SM._rpc_index % Config.rpc_nodes.length];
                        steem.api.setOptions({
                            transport: "http",
                            uri: rpc_node,
                            url: rpc_node,
                            useAppbaseApi: true
                        });
                        console.log(`SWITCHED TO NEW RPC NODE: ${rpc_node}`);
                        setTimeout(()=>SM.BroadcastCustomJsonLocal(id, title, data, callback, retries - 1, supressErrors), 3e3);
                        return
                    } else if (!supressErrors) {
                        alert("There was an error publishing this transaction to the Hive blockchain. Please try again in a few minutes. Error: " + err)
                    }
                    SM.LogEvent("custom_json_failed", {
                        response: JSON.stringify(err)
                    });
                    if (callback)
                        callback(result)
                }
            })
        }
    },
    CheckForMessage(type, callback) {
        SM.Api("/players/messages", {
            type: type
        }, function(response) {
            if (!response.error && response.length > 0 && callback)
                callback(response)
        })
    },
    CheckForMessages(types, callback) {
        SM.Api("/players/messages", {
            types: types.join(",")
        }, function(response) {
            if (!response.error && response.length > 0 && callback)
                callback(response)
        })
    },
    MessagesByType: async function(types) {
        return await SM.ApiAsync("/players/messages", {
            types: types.join(",")
        })
    },
    GetTournamentMessages(tid, callback) {
        SM.Api("/players/messages", {
            tid: tid
        }, r=>{
            if (!r.error && r.length > 0 && callback)
                callback(r)
        }
        )
    },
    ShowChallenge(msg) {
        var data = JSON.parse(msg.data);
        if (SM.GetCurrentBlockNum() + 10 > data.expiration_block_num) {
            SM.MarkAsRead(msg.id);
            return
        }
        data.message = msg;
        SM.ShowNoty(msg.id, "challenge", data, true)
    },
    _noties: {},
    ShowNoty(id, type, data, timer) {
        if (!id)
            id = generatePassword(10);
        if (data)
            data.noty_id = id;
        SM._noties[id] = new Noty({
            type: type,
            data: data,
            closeWith: "button"
        });
        SM._noties[id].show();
        if (timer) {
            updateNotifTimer(id, data.expiration_block_num);
            async function updateNotifTimer(id, block) {
                if (SM._noties[id].closed)
                    return;
                var time = await timeUntilBlock(block);
                if (time <= 0) {
                    SM._noties[id].close();
                    return
                }
                var mins = Math.floor(time / 6e4);
                $("#notif_mins_" + id).text(mins + " minute" + (mins == 1 ? "" : "s") + " left!");
                setTimeout(()=>updateNotifTimer(id, block), 10 * 1e3)
            }
        }
    },
    MarkAsRead(id) {
        SM.Api("/players/mark_as_read", {
            id: id
        })
    },
    ViewChallenge(data, msg_id) {
        SM.Api("/players/outstanding_match", {
            head_block: SM.GetCurrentBlockNum()
        }, function(result) {
            if (result && result.id) {
                new Noty({
                    type: "alert",
                    theme: "sm",
                    timeout: 5e3,
                    text: "You are already in or looking for a match. Please cancel or finish the current match before viewing this challenge."
                }).show()
            } else {
                SM.Api("/battle/status", {
                    id: data.id
                }, r=>{
                    if (r && r.status == 0) {
                        if (msg_id && SM._noties[msg_id])
                            SM._noties[msg_id].close();
                        SM.ShowDialog("view_challenge", data, null, null, "static")
                    } else {
                        if (msg_id && SM._noties[msg_id])
                            SM._noties[msg_id].close();
                        SM.MarkAsRead(msg_id);
                        new Noty({
                            type: "alert",
                            theme: "sm",
                            timeout: 5e3,
                            text: "@" + data.challenger + " has cancelled the challenge."
                        }).show()
                    }
                }
                )
            }
        })
    },
    AcceptChallenge(id, opponent, settings, msg_id) {
        SM.ShowLoading();
        SM.in_battle = true;
        SM.BroadcastCustomJson("sm_accept_challenge", "Steem Monsters Accept Challenge", {
            id: id
        }, function(result) {
            SM.HideLoading();
            if (result && !result.error && result.trx_info && result.trx_info.success) {} else {
                alert("There was an error accepting the challenge - Error: " + result.error);
                SM.in_battle = false
            }
            if (msg_id)
                SM.MarkAsRead(msg_id)
        }, 1, true)
    },
    DeclineChallenge(id, msg_id) {
        SM.BroadcastCustomJson("sm_decline_challenge", "Steem Monsters Decline Challenge", {
            id: id
        }, function(result) {
            SM.HideLoading();
            SM.HideDialog();
            if (msg_id)
                SM.MarkAsRead(msg_id)
        }, 1, true)
    },
    ShowBattleDetails(id) {
        SM.ShowDialog("battle_details", {
            id: id
        }, "/battle/result")
    },
    GetCurrentBlockNum() {
        return Math.max(Math.floor((Date.now() - SM.settings.timestamp) / 3e3), 0) + SM.settings.last_block
    },
    CanPlayCard(card) {
        if (card.market_id && card.market_listing_status == 0)
            return false;
        if (!card.last_transferred_date || !card.last_used_date || (card.delegated_to ? card.delegated_to == card.last_used_player : card.player == card.last_used_player))
            return true;
        var cooldown_start = new Date(SM.settings.timestamp - SM.settings.transfer_cooldown_blocks * 3e3);
        return new Date(card.last_transferred_date) <= cooldown_start || new Date(card.last_used_date) <= cooldown_start
    },
    CooldownSeconds(card, is_market) {
        if (is_market) {
            if (!card.last_used_date)
                return 0;
            let cooldown_start = new Date(SM.settings.timestamp - SM.settings.transfer_cooldown_blocks * 3e3);
            let last_used_date = new Date(card.last_used_date);
            if (last_used_date > cooldown_start) {
                var seconds_since_last_used = (SM.settings.timestamp - last_used_date.getTime()) / 1e3;
                return SM.settings.transfer_cooldown_blocks * 3 - seconds_since_last_used
            }
        } else {
            if (!card.last_transferred_date || !card.last_used_date)
                return 0;
            let cooldown_start = new Date(SM.settings.timestamp - SM.settings.transfer_cooldown_blocks * 3e3);
            let last_used_date = new Date(card.last_used_date);
            if (new Date(card.last_transferred_date) > cooldown_start && last_used_date > cooldown_start && (card.delegated_to ? card.delegated_to != card.last_used_player : card.player != card.last_used_player)) {
                var seconds_since_last_used = (SM.settings.timestamp - last_used_date.getTime()) / 1e3;
                return SM.settings.transfer_cooldown_blocks * 3 - seconds_since_last_used
            }
        }
        return 0
    },
    GetSplinterFromColor(color) {
        color = color.toLowerCase();
        var splinter = color == "red" ? "Fire" : color == "blue" ? "Water" : color == "green" ? "Earth" : color == "black" ? "Death" : color == "white" ? "Life" : color == "gray" ? "Neutral" : "Dragon";
        return splinter
    },
    ShowPlayerProfile(player) {
        SM.ShowDialog("player_profile", {
            name: player,
            season_details: true
        }, "/players/details")
    },
    _viewedBattles: null,
    UpdateViewedBattles(battle_id) {
        if (!SM._viewedBattles) {
            SM._viewedBattles = JSON.parse(localStorage.getItem("sm_battles"));
            if (!SM._viewedBattles)
                SM._viewedBattles = []
        }
        if (SM._viewedBattles.indexOf(battle_id) >= 0)
            return;
        SM._viewedBattles.push(battle_id);
        localStorage.setItem("sm_battles", JSON.stringify(SM._viewedBattles.slice(-10)))
    },
    DidViewBattle(battle_id) {
        if (!SM._viewedBattles) {
            SM._viewedBattles = JSON.parse(localStorage.getItem("sm_battles"));
            if (!SM._viewedBattles)
                SM._viewedBattles = []
        }
        return SM._viewedBattles.indexOf(battle_id) >= 0
    },
    TournamentOngoingSort(a, b) {
        var a_val = a.current_player_status ? parseInt(a.current_player_status) : 0;
        var b_val = b.current_player_status ? parseInt(b.current_player_status) : 0;
        if (a_val === b_val) {
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        }
        return a_val - b_val
    },
    ShowTournaments() {
        SM.HighlightMenuItem("tournaments");
        SM.Api("/tournaments/in_progress", {}, ip=>{
            ip = ip.filter(t=>t.cur_player_entered == "1");
            ip.forEach(t=>t.is_my_ongoing = true);
            ip.sort(SM.TournamentOngoingSort);
            SM.Api("/tournaments/upcoming", {}, r=>{
                SM.ShowHomeView("tournaments", ip.concat(r.filter(t=>!t.password_pub_key)))
            }
            )
        }
        )
    },
    ShowTournament(id) {
        SM.HighlightMenuItem("tournaments");
        if (!id && current_tournament)
            id = current_tournament.id;
        SM.Api("/tournaments/find", {
            id: id,
            player_limit: 100
        }, r=>SM.ShowHomeView("tournament", r, {
            id: id
        }))
    },
    CalculatePlayerTournamentPower(account_name, allowed_cards, collection) {
        var isEditionRestricted = allowed_cards.editions.length > 0 && allowed_cards.editions.length < SM.settings.num_editions;
        var player_tournament_cp = 0;
        if (allowed_cards.foil === "all" && allowed_cards.type === "all" && !isEditionRestricted && SM.Player && account_name === SM.Player.name) {
            player_tournament_cp = SM.Player.collection_power
        } else {
            for (var card_type = 0; card_type < collection.length; card_type++) {
                var card_details = collection[card_type];
                if (card_details.rarity === 4 && (allowed_cards.type === "no_legendaries" || allowed_cards.type === "no_legendary_summoners" && card_details.type === "Summoner")) {
                    continue
                }
                var owned = card_details.owned;
                if (owned && owned.length > 0) {
                    for (var index = 0; index < owned.length; index++) {
                        var card = owned[index];
                        if (card.market_id && card.market_listing_type == "SELL" || card.uid.startsWith("starter-") || card.delegated_to && card.delegated_to !== account_name || allowed_cards.foil === "gold_only" && !card.gold) {
                            continue
                        }
                        if (!isEditionRestricted || isEditionRestricted && allowed_cards.editions.includes(card.edition)) {
                            player_tournament_cp += calculateDEC(card)
                        }
                    }
                }
            }
        }
        player_tournament_cp = Math.round(player_tournament_cp);
        return player_tournament_cp
    },
    EnterTournament: async function(id, fee, allowed_cards_str, prize_currencies, cp_min, signed_pw) {
        if (!SM.Player) {
            SM.ShowLogin();
            return
        }
        if (prize_currencies && prize_currencies.find(c=>{
            var supported = SM.settings.supported_currencies.find(s=>s.currency == c);
            return supported && supported.type == "tron"
        }
        )) {
            var wallet = await SM.ApiAsync("/players/wallets", {
                type: "tron"
            });
            if (!wallet) {
                SM.ShowDialog("link_wallet");
                return
            }
        }
        SM.CheckTournamentCards(allowed_cards_str, cp_min, "tournament", null, ()=>SM.SubmitEnterTournament(id, fee, signed_pw))
    },
    CheckTournamentCards(allowed_cards_str, cp_min, event_type, player, callback) {
        var allowed_cards = JSON.parse(allowed_cards_str);
        var isEditionRestricted = allowed_cards.editions.length > 0 && allowed_cards.editions.length < SM.settings.num_editions;
        var {editionNames: editionNames, editionText: editionText} = constructTournamentAllowedEditionsText(allowed_cards.editions);
        if (allowed_cards.foil === "gold_only" || cp_min > 0 || isEditionRestricted && !allowed_cards.editions.find(e=>SM.settings.starter_editions.includes(e))) {
            SM.LoadCollection(player ? player : SM.Player.name, !!player, collection=>{
                if (cp_min > 0) {
                    var player_tournament_cp = SM.CalculatePlayerTournamentPower(SM.Player.name, allowed_cards, collection);
                    if (player_tournament_cp < cp_min) {
                        showError(SM.Translator.t("components.tournaments.status_pre.min_cp_not_met", {
                            _: `You only have %{power} Power eligible for this event, which is less than the required minimum. Increase your Power by adding more cards to your Collection!`,
                            power: addCommas(player_tournament_cp)
                        }));
                        return
                    }
                }
                var allowed_summoners = 0
                  , allowed_monsters = 0;
                if (allowed_cards.foil === "gold_only") {
                    allowed_summoners = collection.filter(c=>c.type == "Summoner").map(c=>c.owned ? c.owned.filter(o=>o.gold && (!isEditionRestricted || isEditionRestricted && allowed_cards.editions.includes(o.edition))).length : 0).filter(c=>c > 0).length;
                    allowed_monsters = collection.filter(c=>c.type == "Monster").map(c=>c.owned ? c.owned.filter(o=>o.gold && (!isEditionRestricted || isEditionRestricted && allowed_cards.editions.includes(o.edition))).length : 0).filter(c=>c > 0).length;
                    if (allowed_summoners == 0 || allowed_monsters < 6) {
                        let alertMsg = player ? `This is a Gold Card only ${event_type} and it doesn't look like @${player} has enough Gold Cards to participate (need at least 6 Monsters and 1 Summoner).` : `This is a Gold Card only ${event_type} and it doesn't look like you have enough Gold Cards in your collection (need at least 6 Monsters and 1 Summoner). You can get more by purchasing booster packs or buy them directly from the market if you want to participate in these events in the future.`;
                        alert(alertMsg)
                    } else if (allowed_monsters < 20) {
                        let confirmMsg = player ? `This is a Gold Card only ${event_type} and @${player} may not have enough Gold Cards to compete effectively. Are you sure you want to continue?` : `This is a Gold Card only ${event_type}. Please make sure you have enough Gold Cards to participate. You can see what Gold Cards you have by clicking the "Gold Only" button on the collection screen. Are you sure you want to continue?`;
                        if (confirm(confirmMsg)) {
                            callback();
                            return
                        }
                    } else {
                        callback();
                        return
                    }
                } else if (isEditionRestricted) {
                    allowed_summoners = collection.filter(c=>c.type == "Summoner").map(c=>c.owned ? c.owned.filter(o=>allowed_cards.editions.includes(o.edition)).length : 0).filter(c=>c > 0).length;
                    allowed_monsters = collection.filter(c=>c.type == "Monster").map(c=>c.owned ? c.owned.filter(o=>allowed_cards.editions.includes(o.edition)).length : 0).filter(c=>c > 0).length;
                    if (allowed_summoners == 0 || allowed_monsters < 6) {
                        let untamed_text = allowed_cards.editions.includes(4) ? "(or for Untamed by buying more packs from the shop) " : "";
                        let alertMsg = player ? `This ${event_type} is limited to: ${editionText}. It doesn't look like @${player} has enough such cards to participate (need at least 6 Monsters and 1 Summoner).` : `This ${event_type} is limited to: ${editionText}. It doesn't look like you have enough such cards in your collection (need at least 6 Monsters and 1 Summoner). You can get more by purchasing them from other players on the market ${untamed_text}if you want to participate in these events in the future.`;
                        alert(alertMsg)
                    } else if (allowed_monsters < 20) {
                        let confirmMsg = player ? `This ${event_type} is limited to: ${editionText}. It looks like @${player} may not have enough such cards to compete effectively. Are you sure you want to continue?` : `This ${event_type} is limited to: ${editionText}. Please make sure you have enough such cards to participate. You can see what cards you have by clicking on a particular card on the collection screen and then choosing the edition icon in the top right of the card details popup. Are you sure you want to continue?`;
                        if (confirm(confirmMsg)) {
                            callback();
                            return
                        }
                    } else {
                        callback();
                        return
                    }
                } else {
                    callback();
                    return
                }
                if (player) {
                    SM.HideLoading()
                }
            }
            )
        } else {
            callback()
        }
    },
    SubmitEnterTournament: async function(id, fee, signed_pw) {
        SM.ShowLoading();
        if (fee && getCurrency(fee) != "DEC" && getCurrency(fee) != "SPS") {
            var tx_id = "sm_enter_tournament";
            if (SM.settings.test_mode)
                tx_id = SM.settings.prefix + tx_id;
            var currency = SM.settings.supported_currencies.find(c=>c.currency == getCurrency(fee));
            var memo = tx_id + ":" + id + ":" + SM.Player.name + ":" + signed_pw;
            if (currency.type == "hive") {
                if (window.hive_keychain) {
                    hive_keychain.requestTransfer(SM.Player.name, SM.settings.account, parseFloat(fee).toFixed(3), memo, currency.currency, function(response) {
                        if (!response.success) {
                            SM.HideLoading();
                            alert("Transaction not completed.")
                        }
                    })
                } else {
                    hiveSignerPayment(SM.settings.account, parseFloat(fee), currency.currency, memo);
                    SM.HideLoading()
                }
            } else if (currency.type == "hive_engine") {
                ssc_he.findOne("tokens", "balances", {
                    symbol: currency.currency,
                    account: SM.Player.name
                }).then(response=>{
                    if (!response || !response.balance || parseFloat(response.balance) < parseFloat(fee)) {
                        SM.HideLoading();
                        return alert(`You do not have enough ${currency.currency} tokens in your Hive Engine account to enter this tournament. Please go to hive-engine.com to pick some up!`)
                    }
                    SM.HiveEngineTransfer(SM.settings.account, currency.currency, parseFloat(fee).toFixed(3), memo, ()=>SM.HideLoading())
                }
                )
            } else if (currency.type == "tron") {
                SM.ECApi("/purchases/get_payment_address", {
                    data: JSON.stringify({
                        tournament_id: id,
                        signed_pw: signed_pw
                    }),
                    type: "tournament_entry",
                    currency: currency.currency
                }, async r=>{
                    if (r && !r.error)
                        try {
                            let tron_tx = await tronWeb.trx.sendTransaction(r.wallet_address, tronWeb.toSun(parseFloat(fee)));
                            if (tron_tx && tron_tx.code)
                                throw tron_tx.code
                        } catch (err) {
                            SM.HideLoading();
                            SM.ShowDialog("payment_tron", {
                                item_title: "Tournament Payment",
                                item_name: "Entry Fee",
                                usd_amount: toUSD(fee),
                                amount: parseFloat(fee),
                                currency: getCurrency(fee),
                                address: r.wallet_address
                            })
                        }
                    else {
                        alert("There was an error entering this tournament: " + r.error);
                        SM.HideLoading()
                    }
                }
                )
            }
        } else {
            if (fee && !confirm(`This tournament has an entry fee of ${fee} which will be deducted from your balance. Do you want to continue?`))
                return;
            if (parseFloat(fee) > 1e3 || getCurrency(fee) == "SPS") {
                SM.TransferToken(getCurrency(fee), SM.settings.account, parseFloat(fee).toFixed(3), {
                    type: "enter_tournament",
                    tournament_id: id,
                    signed_pw: signed_pw
                }, ()=>{
                    SM.HideLoading();
                    SM.LoadBalances()
                }
                )
            } else {
                let bat_event_list = SM.settings.bat_event_list || [];
                let bat_settings = bat_event_list.find(e=>e.id === id);
                if (bat_settings) {
                    try {
                        const params = await WalletUtils.web3Auth("Brave Tournament Entry");
                        SM.ECApi("/players/bat_entry_check", Object.assign({
                            tournament_id: id,
                            signed_pw: signed_pw
                        }, params), result=>{
                            if (!result || result.error) {
                                SM.HideLoading();
                                if (result && result.err_code === 2) {
                                    if (confirm("This event requires you to hold " + bat_settings.bat + " BAT in your Ethereum or BSC wallet, but you don't have an Ethereum or BSC wallet linked to the game. Would you like to link your Ethereum or BSC wallet now?")) {
                                        SM.ShowDialog("link_wallet", {
                                            curTab: "ethereum"
                                        })
                                    }
                                } else if (result && result.err_code === 4) {
                                    showError("This event requires you to hold " + bat_settings.bat + " BAT in your Ethereum or BSC wallet. You have " + result.balance + " BAT; please add more BAT to your wallet and then try again.")
                                } else {
                                    showError("There was an error checking your BAT token balance. Please try again later.")
                                }
                            }
                        }
                        )
                    } catch (err) {
                        SM.HideLoading();
                        showError(`There was an error entering this tournament: ${err.message}`)
                    }
                } else {
                    SM.BroadcastCustomJson("sm_enter_tournament", "Enter Tournament", {
                        tournament_id: id,
                        signed_pw: signed_pw
                    }, result=>{
                        SM.HideLoading();
                        SM.LoadBalances();
                        if (result && !result.error && result.trx_info && result.trx_info.success)
                            SM.ShowTournament(id)
                    }
                    )
                }
            }
        }
    },
    LeaveTournament(id) {
        if (confirm("Are you sure you want to leave this tournament? Your entry fees will be refunded.")) {
            SM.ShowLoading();
            SM.BroadcastCustomJson("sm_leave_tournament", "Leave Tournament", {
                tournament_id: id
            }, result=>{
                SM.HideLoading();
                if (result && !result.error && result.trx_info && result.trx_info.success)
                    SM.ShowTournament(id)
            }
            )
        }
    },
    CancelTournament(id) {
        if (confirm("Are you sure you want to cancel this tournament? You will lose the tournament creation fee but receive a refund for prizes held in escrow.")) {
            SM.ShowLoading();
            SM.BroadcastCustomJson("sm_cancel_tournament", "Cancel Tournament", {
                tournament_id: id
            }, result=>{
                SM.HideLoading();
                if (result && !result.error && result.trx_info && result.trx_info.success)
                    SM.ShowTournament(id)
            }
            )
        }
    },
    TournamentCheckin(id) {
        SM.ShowLoading();
        SM.BroadcastCustomJson("sm_tournament_checkin", "Tournament Check-In", {
            tournament_id: id
        }, result=>{
            SM.HideLoading();
            if (result && !result.error && result.trx_info && result.trx_info.success)
                SM.ShowTournament(id)
        }
        )
    },
    CreateTournament(data, callback) {
        SM.ShowLoading();
        SM.BroadcastCustomJson("sm_create_tournament", "Create Tournament", data, result=>{
            SM.HideLoading();
            if (callback)
                callback(result && !result.error && result.trx_info && result.trx_info.success ? result.trx_info : null)
        }
        )
    },
    TournamentPayment: async function(tournament_id, payment) {
        var tx_id = "sm_tournament_payment";
        if (SM.settings.test_mode)
            tx_id = SM.settings.prefix + tx_id;
        var currency = SM.settings.supported_currencies.find(c=>c.currency == getCurrency(payment));
        if (currency.type == "hive") {
            if (window.hive_keychain) {
                hive_keychain.requestTransfer(SM.Player.name, SM.settings.account, parseFloat(payment).toFixed(3), tx_id + ":" + tournament_id, getCurrency(payment), function(response) {
                    if (!response.success) {
                        SM.HideLoading();
                        alert("Transaction not completed.")
                    }
                })
            } else {
                hiveSignerPayment(SM.settings.account, parseFloat(payment), getCurrency(payment), tx_id + ":" + tournament_id);
                SM.HideLoading()
            }
        } else if (currency.type == "hive_engine") {
            SM.ShowLoading();
            var balance = await ssc_he.findOne("tokens", "balances", {
                symbol: currency.currency,
                account: SM.Player.name
            });
            SM.HideLoading();
            if (balance && parseFloat(balance.balance) < parseFloat(payment)) {
                alert("Insufficient " + currency.currency + " token balance.");
                return
            }
            SM.HiveEngineTransfer(SM.settings.account, currency.currency, parseFloat(payment).toFixed(3), tx_id + ":" + tournament_id)
        } else if (currency.type == "tron") {
            SM.ECApi("/purchases/get_payment_address", {
                data: tournament_id,
                type: "tournament_payment",
                currency: currency.currency
            }, async r=>{
                if (r && !r.error)
                    try {
                        let tron_tx = await tronWeb.trx.sendTransaction(r.wallet_address, tronWeb.toSun(parseFloat(payment)));
                        if (tron_tx && tron_tx.code)
                            throw tron_tx.code
                    } catch (err) {
                        SM.HideLoading();
                        SM.ShowDialog("payment_tron", {
                            item_title: "Tournament Payment",
                            item_name: "Creation Fee + Prizes",
                            usd_amount: toUSD(payment),
                            amount: parseFloat(payment),
                            currency: getCurrency(payment),
                            address: r.wallet_address
                        })
                    }
                else {
                    alert("There was an error entering this tournament: " + r.error);
                    SM.HideLoading()
                }
            }
            )
        } else if (currency.type == "internal") {
            SM.TransferToken(currency.currency, SM.settings.account, parseFloat(payment).toFixed(3), {
                type: "tournament_payment",
                tournament_id: tournament_id
            }, ()=>SM.LoadBalances())
        }
    },
    ClearTimers() {
        Object.keys(SM.timers).forEach(k=>clearInterval(SM.timers[k]))
    },
    DelegateCards: function(to, card_ids, callback) {
        var obj = {
            to: to,
            cards: card_ids
        };
        SM.BroadcastCustomJson("sm_delegate_cards", "Delegate Cards", obj, result=>{
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                if (callback)
                    callback(result)
            } else if (callback)
                callback(result)
        }
        )
    },
    UndelegateCards: function(card_ids, callback) {
        var obj = {
            cards: card_ids
        };
        SM.BroadcastCustomJson("sm_undelegate_cards", "Delegate Cards", obj, result=>{
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                if (callback)
                    callback(result)
            } else if (callback)
                callback(result)
        }
        )
    },
    SetAuthority: function(authority, callback) {
        SM.BroadcastCustomJson("sm_set_authority", "Update Account Authority", authority, result=>{
            if (result && !result.error && result.trx_info && result.trx_info.success) {
                if (callback)
                    callback(result)
            } else if (callback)
                callback(result)
        }
        )
    },
    SteemEngineTransfer: function(to, token, quantity, memo, callback) {
        SM.EngineTransfer("steem", to, token, quantity, memo, callback)
    },
    HiveEngineTransfer: function(to, token, quantity, memo, callback) {
        SM.EngineTransfer("hive", to, token, quantity, memo, callback)
    },
    EngineTransfer: function(chain, to, token, quantity, memo, callback) {
        var transaction_data = {
            contractName: "tokens",
            contractAction: "transfer",
            contractPayload: {
                symbol: token,
                to: to,
                quantity: quantity + "",
                memo: memo
            }
        };
        let chain_id = chain == "hive" ? SM.settings.ssc.hive_chain_id : SM.settings.ssc.chain_id;
        if (chain == "hive" && window.hive_keychain || chain == "steem" && window.steem_keychain) {
            let keychain = chain == "hive" ? hive_keychain : steem_keychain;
            if (chain === "steem") {
                SM.ApiAsync("/players/wallets").then(wallets=>{
                    const steemWallet = wallets.find(wallet=>wallet.type == "steem");
                    if (steemWallet) {
                        return steemWallet.address
                    } else {
                        const switchToHiveDate = new Date("2020-06-01 12:00:00Z").getTime();
                        const joinDate = new Date(SM.Player.join_date).getTime();
                        if (joinDate > switchToHiveDate) {
                            SM.ShowDialog("link_wallet", {
                                curTab: "steem"
                            });
                            return null
                        } else {
                            return SM.Player.name
                        }
                    }
                }
                ).then(account=>{
                    if (!account)
                        return;
                    keychain.requestCustomJson(account, chain_id, "Active", JSON.stringify(transaction_data), "Transfer Token: " + token, function(response) {
                        if (response.success && response.result) {
                            SM.CheckSETransaction(response.result.id, result=>{
                                SM.HideLoading();
                                if (callback)
                                    callback(result)
                            }
                            )
                        } else {
                            if (callback)
                                callback(response)
                        }
                    })
                }
                )
            } else {
                keychain.requestCustomJson(SM.Player.name, chain_id, "Active", JSON.stringify(transaction_data), "Transfer Token: " + token, function(response) {
                    if (response.success && response.result) {
                        SM.CheckSETransaction(response.result.id, result=>{
                            SM.HideLoading();
                            if (callback)
                                callback(result)
                        }
                        )
                    } else {
                        if (callback)
                            callback(response)
                    }
                })
            }
        } else {
            if (chain != "hive") {
                alert('The SteemConnect service is no longer available. Please go to steem-engine.com and transfer tokens to the "steemmonsters" account to send them into the game.');
                if (callback)
                    callback(null);
                return
            }
            var url = `https://hivesigner.com/sign/custom-json?authority=active`;
            url += "&required_posting_auths=" + encodeURI("[]");
            url += "&required_auths=" + encodeURI('["' + SM.Player.name + '"]');
            url += "&id=" + chain_id;
            url += "&json=" + encodeURI(JSON.stringify(transaction_data));
            popupCenter(url, "steemconnect", 600, 800);
            SM.HideLoading();
            SM.ShowDialog("process_payment", {
                currency: "STEEM"
            });
            if (callback)
                callback(null)
        }
    },
    CheckSETransaction(trx_id, callback, retries) {
        if (isNaN(retries))
            retries = 0;
        SM.Api("/transactions/lookup_se", {
            trx_id: trx_id
        }, result=>{
            if (result.trx_info) {
                if (callback)
                    callback(result)
            } else if (retries < 6)
                setTimeout(()=>SM.CheckSETransaction(trx_id, callback, retries + 1), 5e3);
            else if (callback)
                callback(result)
        }
        )
    },
    PurchaseSkin: function(skin, card_detail_id, callback) {
        SM.BroadcastCustomJson("sm_purchase_skin", "Purchase Skin", {
            skin: skin,
            card_detail_id: card_detail_id
        }, callback)
    },
    PurchaseSkinSet: function(skin, set, callback) {
        SM.BroadcastCustomJson("sm_purchase_skin_set", "Purchase Skin Set", {
            skin: skin,
            set: set
        }, callback)
    },
    PurchaseDice: function(qty, callback) {
        SM.BroadcastCustomJson("sm_purchase_dice", "Purchase Essence Orbs", {
            qty: qty
        }, callback)
    },
    ShowMysteryRewards: function(messages) {
        if (messages && messages.length > 0) {
            var n = new Noty({
                type: "mystery_reward",
                data: null,
                callbacks: {
                    onClick: function() {
                        SM.ShowDialog("open_mystery", messages.map(m=>Object.assign(JSON.parse(m.data), {
                            msg_id: m.id
                        })))
                    }
                }
            });
            n.show()
        }
    },
    ShowDailyUpdate: function() {
        SM.Api("/players/daily_updates", null, r=>{
            if (r && !r.error && r.enabled)
                SM.ShowDialog("daily_update", r)
        }
        )
    },
    UpdatePlayerProfile(data) {
        return SM.ApiAsync("/players/updateProfile", data)
    },
    IsDisplayNameUnique(name) {
        return SM.ApiAsync(`/players/exists/${name}`)
    },
    PrepareTx(tx) {
        return Object.assign({
            ref_block_num: SM.settings.chain_props.ref_block_num & 65535,
            ref_block_prefix: SM.settings.chain_props.ref_block_prefix,
            expiration: new Date(new Date(SM.settings.chain_props.time + "Z").getTime() + 600 * 1e3)
        }, tx)
    },
    async SignTx(tx, use_active) {
        return new Promise(async(resolve,reject)=>{
            try {
                if (!tx.expiration)
                    tx = SM.PrepareTx(tx);
                let signed_tx = null;
                if (SM._use_keychain || use_active && window.hive_keychain) {
                    let response = await new Promise(resolve=>hive_keychain.requestSignTx(SM.Player.name, tx, use_active ? "Active" : "Posting", resolve));
                    if (response && response.success)
                        signed_tx = response.result;
                    else
                        return reject(response)
                } else {
                    let key = localStorage.getItem("key");
                    if (!key)
                        return reject({
                            error: "Key not found."
                        });
                    signed_tx = steem.auth.signTransaction(tx, [key])
                }
                signed_tx.expiration = signed_tx.expiration.split(".")[0];
                resolve(signed_tx)
            } catch (err) {
                reject(err)
            }
        }
        )
    },
    async ServerBroadcastTx(tx, use_active) {
        return new Promise(async(resolve,reject)=>{
            try {
                let signed_tx = await SM.SignTx(tx, use_active);
                if (!signed_tx)
                    return;
                let op_name = removeTxPrefix(tx.operations[0][1].id);
                if (SM.settings.api_ops && SM.settings.api_ops.includes(op_name)) {
                    jQuery.post(`${Config.api_url}/battle/battle_tx`, {
                        signed_tx: JSON.stringify(signed_tx)
                    }, resolve).fail(reject);
                    return
                }
                let bcast_url = Config.tx_broadcast_urls[Math.floor(Math.random() * Config.tx_broadcast_urls.length)];
                jQuery.post(`${bcast_url}/send`, {
                    signed_tx: JSON.stringify(signed_tx)
                }, resolve).fail(reject)
            } catch (err) {
                reject(err)
            }
        }
        )
    },
    GetDidYouKnow() {
        return new Promise(resolve=>{
            const locale = localStorage.getItem("locale");
            const key = `dyk-${locale}`;
            if (window.sessionStorage.hasOwnProperty(key)) {
                return resolve(JSON.parse(window.sessionStorage.getItem(key)))
            }
            SM.Api(`/players/dyk/${locale}`, null, res=>{
                window.sessionStorage.setItem(key, JSON.stringify(res));
                resolve(res)
            }
            )
        }
        )
    },
    AdvanceLeaderboard: function(notify, callback) {
        if (confirm(SM.Translator.t("battle_history.adv_confirm", {
            _: `Are you sure you want to advance? This will move you up to the next leaderboard to earn greater rewards. But you will face deadlier foes, and cannot return to a previous leaderboard until next season.`
        }))) {
            let trx_params = notify ? {
                notify: true
            } : {};
            SM.ShowLoading();
            SM.BroadcastCustomJson("sm_advance_league", "Advance League", trx_params, r=>{
                SM.HideLoading();
                if (r && r.trx_info && r.trx_info.success && r.trx_info.result) {
                    let refresh_data = tryParse(r.trx_info.result);
                    SM.Player = Object.assign(SM.Player, refresh_data);
                    SM.ShowBattleHistory()
                }
                if (callback)
                    callback(r)
            }
            )
        }
    },
    async GetPlayerProperties() {
        return await SM.ApiAsync("/player_properties")
    },
    async GetPlayerProperty(propName) {
        return await SM.ApiAsync(`/player_properties/${propName}`)
    },
    async SetPlayerProperty(propName, value) {
        return await SM.Post(`/player_properties/${propName}`, {
            value: value
        })
    },
    async UpdatePlayerProperty(player, propName, value) {
        return await SM.Put(`/player_properties/${propName}`, {
            value: value
        })
    },
    async DeletePlayerProperty(propName) {
        return await SM.Delete(`/player_properties/${propName}`)
    },
    ShowVerificationStatus() {
        SM.Api("/players/id_verification_status", {}, result=>{
            let code = null;
            if (result && result.status === "CLEAR")
                code = "verification_clear";
            else if (result && result.status === "CONSIDER")
                code = "verification_consider";
            else if (result && result.status === "PENDING")
                code = "verification_pending";
            SM.ShowDialog("shop/onfido", {
                code: code
            })
        }
        )
    }
};
$(()=>{
    Noty.overrideDefaults({
        callbacks: {
            onTemplate: function() {
                if (this.options.type === "challenge") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/challenge", this.options.data)
                } else if (this.options.type === "reveal_rewards") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/reveal_rewards", this.options.data)
                } else if (this.options.type === "tournament_battle") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/tournament_battle", this.options.data)
                } else if (this.options.type === "tournament_start") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/tournament_start", this.options.data)
                } else if (this.options.type === "tournament_checkin") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/tournament_checkin", this.options.data)
                } else if (this.options.type === "tournament_return") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/tournament_return", this.options.data)
                } else if (this.options.type === "gifts_received") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/gifts_received", this.options.data)
                } else if (this.options.type === "mystery_reward") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/mystery_reward", this.options.data)
                } else if (this.options.type === "guild_update") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/guild_update", this.options.data)
                } else if (this.options.type === "system_message") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/system_message", this.options.data)
                } else if (this.options.type === "swiss_battle_result") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/swiss_battle_result", this.options.data)
                } else if (this.options.type === "swiss_in_progress") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/swiss_in_progress", this.options.data)
                } else if (this.options.type === "swiss_round_started") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/swiss_round_started", this.options.data)
                } else if (this.options.type === "swiss_battle_flee") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/swiss_battle_flee", this.options.data)
                } else if (this.options.type === "tournament_sitngo_capacity") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/tournament_sitngo_capacity", this.options.data)
                } else if (this.options.type === "brawl_in_progress") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/brawl_in_progress", this.options.data)
                } else if (this.options.type === "brawl_start") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/brawl_start", this.options.data)
                } else if (this.options.type === "brawl_fray_status") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/brawl_fray_status", this.options.data)
                } else if (this.options.type === "brawl_only_guild") {
                    this.barDom.innerHTML = SM.ShowComponent("/notifications/brawl_only_guild", this.options.data)
                }
            }
        }
    })
}
);
const SMPlayerProperties = Object.freeze({
    WelcomeButtonClicked: "welcome button clicked"
});
Messenger = {
    ws: null,
    ping_interval: null,
    session_id: null,
    player: null,
    Connect(player, token, new_account) {
        if (Messenger.ws && Messenger.ws.readyState == 1 && Messenger.player == player)
            return;
        Messenger.player = player;
        if (!Messenger.session_id)
            Messenger.session_id = generatePassword(10);
        Messenger.ws = new WebSocket(Config.ws_url);
        console.log("Opening socket connection...");
        Messenger.ws.onopen = function() {
            if (new_account)
                Messenger.Send({
                    type: "new_account",
                    player: player,
                    session_id: Messenger.session_id
                });
            else
                Messenger.Send({
                    type: "auth",
                    player: player,
                    access_token: token,
                    session_id: Messenger.session_id
                })
        }
        ;
        Messenger.ws.onmessage = Messenger.OnMessage;
        Messenger.ws.onerror = Messenger.OnError;
        Messenger.ws.onclose = Messenger.OnClose;
        if (Messenger.ping_interval)
            clearInterval(Messenger.ping_interval);
        Messenger.ping_interval = setInterval(Messenger.Ping, 60 * 1e3)
    },
    Close() {
        Messenger.ws.close()
    },
    OnMessage(m) {
        console.log(m);
        var message = JSON.parse(m.data);
        if (message && message.server_time)
            SM._server_time_offset = Date.now() - message.server_time;
        if (message.id && Messenger[message.id])
            Messenger[message.id](message.data);
        if (message.ack)
            Messenger.Send({
                type: "ack",
                msg_id: message.msg_id
            })
    },
    OnError(e) {
        console.log("Socket error...");
        console.log(e)
    },
    OnClose(e) {
        console.log("Socket closed...");
        console.log(e);
        if (SM.Player)
            setTimeout(()=>Messenger.Connect(SM.Player.name, SM.Player.token), 1e3)
    },
    Send(message) {
        Messenger.ws.send(JSON.stringify(message))
    },
    Ping() {
        Messenger.Send({
            type: "ping"
        })
    },
    match_found(data) {
        if (SM.in_battle && SM.CurrentView.view != "create_team2" && data.status !== 6) {
            SM._currentBattle = data;
            SM.HideDialog(true);
            SM.ShowEnemyFound(data)
        }
    },
    battle_result(data) {
        snapyr.track("battle_result", {
            match_type: data.match_type,
            winner: data.winner
        });
        if (SM.in_battle && SM._currentBattle && SM._currentBattle.id === data.id) {
            SM.HideDialog(true);
            SM.LoadBattle(data.id);
            SM._currentBattle = null;
            SM.in_battle = false
        }
        if (SM.Player.battles == 0) {
            WomplayTracking("completed_first_battle")
        }
    },
    find_match_cancelled(data) {
        if (SM.in_battle) {
            SM._currentBattle = null;
            SM.in_battle = false;
            SM.HideLoading();
            SM.HideDialog(true)
        }
    },
    battle_cancelled(data) {
        if (SM.in_battle) {
            SM._currentBattle = null;
            SM.in_battle = false;
            SM.HideDialog();
            SM.ExitBattlePopup();
            new Noty({
                type: "alert",
                theme: "sm",
                timeout: 3e4,
                text: "Neither player submitted a team in the allotted time. The battle has been cancelled."
            }).show()
        }
    },
    match_not_found(data) {
        if (SM.in_battle) {
            SM._currentBattle = null;
            SM.in_battle = false;
            SM.HideDialog(true);
            new Noty({
                type: "alert",
                theme: "sm",
                timeout: 3e4,
                text: "No suitable match could be found."
            }).show()
        }
    },
    opponent_submit_team(data) {
        if (SM.in_battle && (!SM._currentBattle || ![6, 7].includes(SM._currentBattle.status) && ![6, 7].includes(data.status))) {
            SM._currentBattle = data
        }
    },
    transaction_complete(data) {
        let id = data.sm_id || data.trx_info.id;
        var trx = SM._transactions[id];
        if (trx) {
            if (data.error && !trx.suppressError) {
                new Noty({
                    type: "alert",
                    theme: "sm",
                    timeout: 3e4,
                    text: "There was an error completing this transaction: " + data.error
                }).show()
            }
            clearTimeout(trx.timeout);
            if (trx.callback)
                trx.callback(data);
            delete SM._transactions[id]
        } else if (!data.trx_info.id.startsWith("sm_"))
            SM._transactions[id] = {
                status: "complete",
                data: data
            }
    },
    purchase_complete(data) {
        if (SM._payment_callback)
            SM._payment_callback();
        SM.OnPurchaseComplete(data)
    },
    market_purchase_complete(data) {
        SM.HideDialog()
    },
    market_purchase_failed(data) {
        SM.HideDialog();
        SM.ShowMarket(true);
        new Noty({
            type: "alert",
            theme: "sm",
            timeout: 3e4,
            text: "Market purchase error: " + data.error + ". Payments have been refunded to your account."
        }).show()
    },
    challenge(data) {
        SM.ShowChallenge(data)
    },
    challenge_declined(data) {
        SM.HideDialog(true);
        new Noty({
            type: "alert",
            theme: "sm",
            timeout: 3e4,
            text: "@" + data.opponent_player + " has declined your challenge."
        }).show()
    },
    enter_tournament(data) {
        SM.HideLoading();
        SM.ShowTournament(data.id);
        SM.ShowDialog("enter_tournament", data)
    },
    tournament_payment(data) {
        SM.HideLoading();
        setTimeout(()=>SM.ShowTournament(data.id), 1e3);
        new Noty({
            type: "success",
            theme: "sm",
            timeout: 1e4,
            text: "Tournament payment received!"
        }).show()
    },
    swiss_battle_flee(data) {
        console.log("Anytime Flee Event Message Received!");
        SM.ShowNoty(data.tournament_id + "-" + data.opponent, "swiss_battle_flee", data, true);
        if (SM.Player.guild && data.tournament_id === SM.Player.guild.tournament_id) {
            sendNotification("Brawl Battle Won!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "@" + data.opponent + " has fled from your overwhelming might. Click here to see your progress!", ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl"))
        } else {
            sendNotification("Anytime Battle Won!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "@" + data.opponent + " has fled from your overwhelming might. Click here to see your progress!", ()=>SM.ShowTournament(data.tournament_id))
        }
    },
    swiss_battle_result(data) {
        console.log("Anytime Battle Event Message Received!");
        if (SM.in_battle && SM._currentBattle && SM._currentBattle.id === data.battle_id) {
            return
        }
        SM.ShowNoty(data.tournament_id + "-" + data.opponent, "swiss_battle_result", data, true);
        if (SM.Player.guild && data.tournament_id === SM.Player.guild.tournament_id) {
            sendNotification("Brawl Battle Started!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "@" + data.opponent + " is fighting your team. Click here to see your progress!", ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl"))
        } else {
            sendNotification("Anytime Battle Started!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "@" + data.opponent + " is fighting your team. Click here to see your progress!", ()=>SM.ShowTournament(data.tournament_id))
        }
    },
    tournament_started(data) {
        if (data.sub_format === "brawl") {
            console.log("Brawl Started Message Received!");
            if (SM.Player.guild) {
                SM.ShowNoty(data.id, "brawl_start", data, false);
                sendNotification("Brawl Started!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "Your guild's next Brawl has started. Click here to play!", ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl", "show-intro"))
            }
        } else {
            console.log("Tournament Started Message Received!");
            SM.ShowNoty(data.id, "tournament_start", data, false);
            sendNotification("Tournament Started!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "The " + data.name + " tournament has started. Click here to play!", ()=>SM.ShowTournament(data.id))
        }
    },
    tournament_round_started(data) {
        console.log("Tournament Round Started Message Received!");
        if (data.format === "swiss") {
            SM.ShowNoty(data.id + "-round-start", "swiss_round_started", data, true)
        }
        sendNotification("Round " + data.round + " Started!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "Round " + data.round + " has started in the " + data.name + " tournament. Click here to play!", ()=>SM.ShowTournament(data.id))
    },
    tournament_checkin(data) {
        console.log("Tournament Check In Message Received!");
        SM.ShowNoty(data.id, "tournament_checkin", data, false);
        sendNotification("Time to Check In!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "The " + data.name + " tournament is starting soon. Click here to check in now!", ()=>SM.ShowTournament(data.id))
    },
    tournament_sitngo_capacity(data) {
        console.log("Tournament Sit N Go Capacity Message Received!");
        SM.ShowNoty(data.id + "-" + data.percent, "tournament_sitngo_capacity", data, true);
        if (data.percent < 99) {
            sendNotification("Sit N Go " + data.percent + "% full!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "The " + data.name + " event has " + data.num_entrants + " of " + data.max_entrants + " players entered. Be ready to start soon!", ()=>SM.ShowTournament(data.id))
        } else {
            sendNotification("Sit N Go almost full!", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "The " + data.name + " event only needs 1 more player to join before starting. Get ready to rumble!", ()=>SM.ShowTournament(data.id))
        }
    },
    tournament_next_battle(data) {
        console.log("Tournament Next Battle Message Received!");
        if (SM.CurrentView.view != "tournament")
            SM.ShowNoty(data.tournament_id, "tournament_battle", data, true)
    },
    received_gifts(data) {
        console.log("received_gifts", data);
        var obj = {
            id: generatePassword(10)
        };
        if (SM.settings.card_holding_accounts.some(acc=>data.from === acc.accountName)) {
            if (data.type == "card") {
                if (SM._activeDialogName === "misc/send_cards_back_to_steem") {
                    SM.HideDialog()
                }
                if (SM.CurrentView.view === "card_details") {
                    SM.LoadCollection(SM.Player.name, true, function(collection) {
                        const {card_detail_id: id, gold: gold, edition: edition} = data.cards[0];
                        SM.ShowCardDetails(id, gold, edition)
                    })
                }
            }
            return
        }
        if (data.type == "card") {
            obj.gifts = data.cards.map(c=>Object.assign(c, {
                type: data.type,
                from: data.from
            }))
        } else
            obj.gifts = [data];
        SM.ShowNoty(obj.id, "gifts_received", obj, false)
    },
    async sg_promo(data) {
        SM.ShowDialog("open_rewards", data)
    },
    packs_redeemed(data) {
        if (!SM._currentBattle) {
            SM.HideDialog();
            SM.ShowOpenPacks()
        }
    },
    async promo_code(data) {
        console.log(data);
        if (SM.Player) {
            if (SM.Player.starter_pack_purchase) {
                alert(`This promo code is for a Summoner's Spellbook which has already been purchased for this account.`);
                return
            }
            let purchase = await SM.StartPurchase("starter_pack", 1, "PROMO", null, null, null, "promo_gift");
            if (!purchase || purchase.error) {
                alert("There was an error completing your purchase: " + purchase ? purchase.error : "Unknown error.");
                return
            }
            SM.ShowDialog("payment", Object.assign({
                code: data.code,
                title: "CODE ACCEPTED"
            }, purchase))
        } else
            SM.ShowDialog("create_account", {
                code: data.code
            }, null, null, "static")
    },
    refund(data) {
        var notyText = "You will receive a payment of " + data.amount + " " + data.currency + " for reason: " + data.reason;
        new Noty({
            type: "success",
            theme: "sm",
            timeout: 3e4,
            text: notyText
        }).show();
        sendNotification("Incoming Payment!", null, notyText)
    },
    guild_test(data) {
        GLD.socket(data);
        if (data.currency == "DEC")
            setTimeout(()=>SM.LoadBalances(), 2e3)
    },
    dec_transfer(data) {
        new Noty({
            type: "success",
            theme: "sm",
            timeout: 3e4,
            text: `You have received ${data.amount} ${data.token || "DEC"} from: ${data.from}`
        }).show();
        SM.LoadBalances();
        if (SM._activeDialogName == "process_payment" && data.from == "@token-converter")
            SM.HideDialog()
    },
    mystery_reward(data) {
        var n = new Noty({
            type: "mystery_reward",
            data: null,
            callbacks: {
                onClick: function() {
                    SM.ShowDialog("open_mystery", [data])
                }
            }
        });
        n.show()
    },
    brawl_fray_update(data) {
        if ($(`.brawl-body[brawl="${data.guild_id}::${data.tournament_id}"]`).length > 0) {
            refreshFrayState(data.guild_id, data.tournament_id, false, false)
        }
    },
    brawl_fray_status(data) {
        console.log("Brawl Fray Assignment Changed!");
        if (SM.Player.guild) {
            SM.ShowNoty(data.id, "brawl_fray_status", data, false);
            let msg_text = null;
            let title_text = null;
            if (data.type === "assign") {
                msg_text = `@${data.source_player} assigned you to Fray ${data.new_fray_index + 1} in the next Brawl!`;
                title_text = "Fray Assigned"
            } else if (data.type === "move") {
                msg_text = `@${data.source_player} moved you from Fray ${data.old_fray_index + 1} to Fray ${data.new_fray_index + 1}!`;
                title_text = "Fray Assignment Changed"
            } else if (data.type === "remove") {
                msg_text = `@${data.source_player} removed you from Fray ${data.old_fray_index + 1}!`;
                title_text = "Removed From Fray"
            } else if (data.type === "cancel") {
                msg_text = `You have no Brawl battles due to a lack of opposing players in your Fray!`;
                title_text = "Fray Canceled"
            }
            sendNotification(title_text, "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", msg_text, ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl"))
        }
    },
    brawl_only_guild(data) {
        console.log("Brawl Only Guild Message Received!");
        if (SM.Player.guild) {
            SM.ShowNoty(`${data.block_num}-${data.guild_id}`, "brawl_only_guild", data, false);
            sendNotification("Brawl Canceled", "https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/img_challenge-sword.png", "Your guild's Brawl has been canceled due to a lack of opposing guilds!", ()=>SM.Guilds.ShowGuild(SM.Player.guild.id, "brawl"))
        }
    },
    guild_chat(data) {
        if ($("#chat_container").length > 0) {
            $(`#chat_container[room=${data.room_id}]`).append(SM.ShowComponent("chat/tavern_chat_msg", data));
            $("#chat_container")[0].scrollTop = 1e5;
            Messenger.Send({
                type: "read_chat_msg",
                player: Messenger.player,
                session_id: Messenger.session_id,
                chat_id: data.id
            })
        } else if ($("#brawl_chat_container").length > 0) {
            $(`#brawl_chat_container[room=${data.room_id}]`).append(SM.ShowComponent("chat/brawl_chat_msg", data));
            $("#brawl_chat_container")[0].scrollTop = 1e5;
            Messenger.Send({
                type: "read_chat_msg",
                player: Messenger.player,
                session_id: Messenger.session_id,
                chat_id: data.id
            })
        } else {
            let element = $("#chat_notif");
            element.text(Math.min(parseInt(element.text()) + 1, 99));
            element.show()
        }
        if ($("#chat_container").length == 0 && $("#brawl_chat_container").length == 0 || document.hidden)
            sendGuildChatNotification(data.player == "$system" ? "SYSTEM" : `@${data.player}`, data.message, data.room_id)
    },
    guild_update(data) {
        SM.UpdatePlayerInfo();
        SM.ShowNoty(null, "guild_update", data);
        if ($(".page-body.shop.guild").length > 0) {
            SM.Api("/players/refresh_guild", {}, data=>{
                if (data && !data.error && !data.guild) {
                    SM.ShowShop()
                }
            }
            )
        }
    },
    system_message(data) {
        SM.ShowNoty("system_message", "system_message", data)
    },
    potion_purchase(data) {
        if (SM._potion_purchase_callback)
            SM._potion_purchase_callback()
    },
    rating_update(data) {
        if (SM.Player) {
            SM.Player.rating = data.new_rating;
            SM.Player.league = data.new_league;
            if (data.new_collection_power !== undefined && SM.Player.collection_power != data.new_collection_power) {
                SM.Player.collection_power = data.new_collection_power;
                SM.Player.collection_dirty = true
            }
            if (data.new_max_league !== undefined) {
                SM.Player.season_max_league = data.new_max_league
            }
        }
    },
    balance_update(data) {
        if (!SM.Player)
            return;
        if (data.player != SM.Player.name)
            return;
        if (!SM.Player.balances)
            SM.Player.balances = [];
        let balance = SM.Player.balances.find(b=>b.token == data.token);
        if (!balance)
            SM.Player.balances.push({
                player: data.player,
                token: data.token,
                balance: parseFloat(data.balance_end)
            });
        else
            balance.balance = parseFloat(data.balance_end);
        if (data.type === "dec_reward") {
            SM.balance_update_deferred = true;
            return
        }
        SM.OnLoadBalances(SM.Player.balances)
    },
    ecr_update(data) {
        if (!SM.Player)
            return;
        if (!SM.Player.balances)
            SM.Player.balances = [];
        let balance = SM.Player.balances.find(b=>b.token == "ECR");
        if (!balance) {
            SM.Player.balances.push({
                player: data.player,
                token: "ECR",
                balance: parseFloat(data.capture_rate),
                last_reward_block: data.last_reward_block,
                last_reward_time: data.last_reward_time
            })
        } else {
            balance.balance = parseFloat(data.capture_rate);
            balance.last_reward_block = data.last_reward_block;
            balance.last_reward_time = data.last_reward_time
        }
        SM.balance_update_deferred = true
    },
    lottery_result(data) {
        SM.ShowDialog("shop/lottery_results", data)
    },
    quest_progress(data) {
        SM.Player.quest = data
    }
};
SM.Guilds = function() {
    return {
        ShowGuilds: ShowGuilds,
        ShowGuild: ShowGuild,
        ShowBanishSelect: ShowBanishSelect
    };
    function ShowGuilds(force_list) {
        SM.HighlightMenuItem("guilds");
        if (force_list || !SM.Player || !SM.Player.guild)
            SM.Api("/guilds/list", null, r=>SM.ShowHomeView("guilds", r));
        else
            SM.Guilds.ShowGuild(SM.Player.guild.id)
    }
    function ShowGuild(id, tab, extra_info) {
        SM.HighlightMenuItem("guilds");
        if (!extra_info) {
            extra_info = "none"
        }
        SM.Api("/guilds/find", {
            id: id,
            ext: tab
        }, r=>SM.ShowHomeView("guild", Object.assign(r, {
            tab: tab,
            extra_info: extra_info
        }), {
            id: id,
            tab: tab
        }))
    }
    function ShowBanishSelect(id, card_num, data) {
        card_num = parseInt(card_num);
        if (isNaN(card_num)) {
            card_num = 1
        }
        SM.LoadCards(()=>{
            SM.HighlightMenuItem("guilds");
            if (!data) {
                SM.Api("/guilds/find", {
                    id: id,
                    ext: "buildings"
                }, r=>{
                    if (r && !r.error) {
                        let is_entitled = r.current_member && r.current_member.status == "active" && r.current_member.rank >= 3 ? true : false;
                        let building = tryParse(r.buildings)["barracks"];
                        let banished_cards = building && building.away_blocked_cards ? building.away_blocked_cards : [];
                        let num_tactics = building && building.perks ? building.perks.length : 0;
                        let banish_level = num_tactics >= 6 ? 2 : num_tactics >= 3 ? 1 : 0;
                        if (card_num > banish_level || banished_cards.length === 0) {
                            card_num = 1
                        }
                        SM.ShowHomeView("banish", {
                            id: id,
                            card_num: card_num,
                            is_entitled: is_entitled,
                            banished_cards: banished_cards,
                            banish_level: banish_level
                        }, {
                            id: id,
                            card_num: card_num
                        })
                    } else {
                        SM.Guilds.ShowGuilds()
                    }
                }
                )
            } else {
                if (card_num > data.banish_level || data.banished_cards.length === 0) {
                    card_num = 1
                }
                data.id = id;
                data.card_num = card_num;
                SM.ShowHomeView("banish", data, {
                    id: id,
                    card_num: card_num
                })
            }
        }
        )
    }
}();
Positions = {
    team1: {
        Summoner: {
            x: 1113,
            y: 540
        },
        1: {
            x: 720,
            y: 297
        },
        2: {
            x: 900,
            y: 540
        },
        3: {
            x: 680,
            y: 540
        },
        4: {
            x: 460,
            y: 540
        },
        5: {
            x: 240,
            y: 540
        },
        6: {
            x: 20,
            y: 540
        }
    },
    team2: {
        Summoner: {
            x: 0,
            y: 54
        },
        1: {
            x: 469,
            y: 297
        },
        2: {
            x: 290,
            y: 54
        },
        3: {
            x: 510,
            y: 54
        },
        4: {
            x: 730,
            y: 54
        },
        5: {
            x: 950,
            y: 54
        },
        6: {
            x: 1170,
            y: 54
        }
    }
};
class BattleTracker {
    constructor(jsonBattleResults, player1, player2, settings) {
        this.roundIndex = 0;
        this.preRoundIndex = 0;
        this.actionIndex = 0;
        this.Results = jsonBattleResults;
        this.monstersCurState = keyBy("uid", [...jsonBattleResults.team1.monsters, ...jsonBattleResults.team2.monsters]);
        this.battleHistory = null;
        this.player1 = player1;
        this.player2 = player2;
        if (settings) {
            this.settings = tryParse(settings)
        }
        SMBPlayback.SetSpeed(1);
        if (jsonBattleResults == null) {
            $.getJSON("test/result.js", results=>{
                this.Results = results
            }
            )
        }
    }
    get isBrawl() {
        return this.Results.is_brawl
    }
    get brawlPerks() {
        if (this.Results.is_brawl && this.Results.perks && !Array.isArray(this.Results.perks)) {
            return this.Results.perks
        }
        return null
    }
    get homePlayer() {
        if (this.Results.is_brawl && this.Results.home && this.Results.away) {
            if (this.Results.home === this.player1.name) {
                return this.player1
            }
            return this.player2
        }
        return null
    }
    get team1() {
        return this.Results.team1
    }
    get team2() {
        return this.Results.team2
    }
    get preBattle() {
        return this.Results.pre_battle
    }
    get isPreBattle() {
        return this.actionIndex == 0 && this.roundIndex == 0
    }
    get numberOfActions() {
        return this.Results.rounds[this.roundIndex] ? this.Results.rounds[this.roundIndex].actions.length : 1
    }
    get numberOfPrebattleActions() {
        return this.Results.pre_battle.length
    }
    gotoBeginning() {
        this.roundIndex = 0;
        this.actionIndex = 0
    }
    nextAction() {
        if (this.roundIndex == this.Results.rounds.length) {
            return {
                BattleEnd: true
            }
        }
        var action = this.Results.rounds[this.roundIndex].actions[this.actionIndex];
        if (action == null) {
            this.roundIndex++;
            this.actionIndex = 0;
            return action
        }
        this.actionIndex++;
        if (this.actionIndex == this.Results.rounds[this.roundIndex].actions.length) {
            this.actionIndex = 0;
            this.roundIndex++
        }
        this.updateMonsterState(action.target, action.state);
        return action
    }
    getBattleLimits() {
        if (this.settings && this.settings.allowed_cards) {
            return {
                editions: this.settings.allowed_cards.editions,
                foil: this.settings.allowed_cards.foil === "gold_only" ? "g" : "s",
                rating_level: this.settings.rating_level
            }
        }
        return null
    }
    getFutureActions(typeFilter, targetFilter) {
        if (!this.Results.rounds[this.roundIndex])
            return [];
        let futureActions = this.Results.rounds[this.roundIndex].actions.slice(this.actionIndex, this.numberOfActions);
        return futureActions.filter(a=>(!typeFilter || a.type == typeFilter) && (!targetFilter || a.target == targetFilter))
    }
    getMonsterStateById(uid) {
        return this.monstersCurState[uid]
    }
    getMonsterById(uid) {
        return this.Results.team1.monsters.concat(this.Results.team2.monsters).find(m=>m.uid === uid)
    }
    updateMonsterState(id, nextState) {
        if (!nextState) {
            this.monstersCurState[id] = {
                alive: false,
                base_health: 0,
                other: [],
                stats: [0, 0, 0, 0, 0, 0]
            }
        } else if (this.monstersCurState[id]) {
            this.monstersCurState[id].state = nextState
        }
    }
    peekCurrentAction() {
        if (this.roundIndex == this.Results.rounds.length) {
            return {
                BattleEnd: true
            }
        }
        var action = this.Results.rounds[this.roundIndex].actions[this.actionIndex];
        return action
    }
    peekNextAction() {
        if (this.roundIndex == this.Results.rounds.length) {
            return {
                BattleEnd: true
            }
        }
        if (this.actionIndex + 1 == this.Results.rounds[this.roundIndex].actions.length && this.roundIndex + 1 == this.Results.rounds.length) {
            return {
                BattleEnd: true
            }
        }
        var action = {};
        if (this.actionIndex + 1 == this.Results.rounds[this.roundIndex].actions.length) {
            action = this.Results.rounds[this.roundIndex + 1].actions[0]
        } else {
            action = this.Results.rounds[this.roundIndex].actions[this.actionIndex + 1]
        }
        return action
    }
    peekNextActionInCurrentRound() {
        return this.Results.rounds[this.roundIndex] ? this.Results.rounds[this.roundIndex].actions[this.actionIndex + 1] : null
    }
    nextPreRoundAction() {
        if (this.preRoundIndex == this.Results.pre_battle.length) {
            return {
                PreRoundEnd: true
            }
        }
        var action = this.Results.pre_battle[this.preRoundIndex];
        this.preRoundIndex++;
        action.group_state.forEach(a=>{
            this.updateMonsterState(a.monster, a.state)
        }
        );
        return action
    }
    peekNextActionInPreBattle() {
        return this.Results.pre_battle[this.preRoundIndex] || null
    }
    saveHistory(roundNumber, team1Array, team2Array) {
        if (this.battleHistory == null)
            this.battleHistory = new Array(this.Results.rounds.length);
        if (this.battleHistory[roundNumber] == null) {
            this.battleHistory[roundNumber] = {
                html: $("#cardArea").html(),
                t1Array: [...team1Array],
                t2Array: [...team2Array]
            }
        }
    }
    restoreHistory(roundNumber) {
        $("#cardArea").html(this.battleHistory[roundNumber].html);
        t1Array = [...this.battleHistory[roundNumber].t1Array];
        t2Array = [...this.battleHistory[roundNumber].t2Array];
        $(".card-damageText").empty();
        this.roundIndex = roundNumber;
        $(".round_number").text(roundNumber + 1);
        this.actionIndex = 0;
        if (roundNumber == 0) {
            this.preRoundIndex = 0
        }
        if (this.roundIndex == 0) {
            $(".action_number").text(this.preRoundIndex + this.actionIndex + 1);
            $(".action_max").text(this.numberOfActions + this.numberOfPrebattleActions)
        } else {
            $(".action_number").text(this.actionIndex + 1);
            $(".action_max").text(this.numberOfActions)
        }
    }
    clearHistory() {
        return this.battleHistory = null
    }
}
class SMBFightTimer {
    static SetTimeout(callback, timeout) {
        this.GLOBAL_FIGHT_TIMER = timeout;
        this.GLOBAL_FIGHT_CALLBACK = callback;
        this.GLOBAL_FIGHT_TIMEOUT_ID = setTimeout(()=>{
            this.GLOBAL_FIGHT_CALLBACK()
        }
        , this.GLOBAL_FIGHT_TIMER)
    }
    static RestartTimeout(timeout) {
        this.GLOBAL_FIGHT_TIMER = timeout;
        clearTimeout(this.GLOBAL_FIGHT_TIMEOUT_ID);
        this.GLOBAL_FIGHT_TIMEOUT_ID = setTimeout(()=>{
            this.GLOBAL_FIGHT_CALLBACK()
        }
        , this.GLOBAL_FIGHT_TIMER)
    }
}
class SMBPlayback {
    static SetSpeed(speed) {
        this.speed = speed;
        anime.speed = speed
    }
    static get Speed() {
        return this.speed == null ? 1 : this.speed
    }
    static get iSpeed() {
        return this.speed == null ? 1 : 1 / this.speed
    }
}
function keyBy(propName, collection) {
    return collection.reduce((acc,obj)=>Object.assign({}, acc, {
        [obj[propName]]: obj
    }), {})
}
class SMBEffects {
    constructor(jsonBattleResults) {
        this.spriteIndex = 1;
        this.fireBallSprite = null;
        this.effectSprite = null
    }
    playRandomHitEffect() {
        if (this.spriteIndex == 21)
            this.spriteIndex = 1;
        const sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "hit_effects/" + this.spriteIndex + ".png",
            cols: 4,
            rows: 4
        },"#spriteHitEffect");
        $("#spriteHitEffect").show();
        sprite.play({
            run: 1,
            delay: 25 * SMBPlayback.iSpeed,
            onStop: ()=>{
                $("#spriteHitEffect").hide()
            }
        });
        this.spriteIndex++
    }
    playFireBall() {
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "Projectiles/Fireball.png",
            cols: 3,
            rows: 3,
            cutOffFrames: 1,
            downsizeRatio: 2.5
        },"#spriteProjectile");
        $("#spriteProjectile").show();
        sprite.play({
            run: -1,
            delay: 40 * SMBPlayback.iSpeed,
            onStop: ()=>{
                $("#spriteProjectile").hide()
            }
        });
        return sprite
    }
    playSmoke(targetContainer) {
        var sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/smoke.png",
            cols: 4,
            rows: 3
        },targetContainer + " .effect");
        $(targetContainer + " .effect").show();
        $(targetContainer + " .effect").css("transform", "scale(1.2) rotateZ(-70deg) translateX(100px) translateY(-45px)");
        sprite.play({
            run: 1,
            delay: 50 * SMBPlayback.iSpeed,
            onStop: ()=>{
                $(targetContainer + " .effect").hide()
            }
        });
        return sprite
    }
    playHeal(targetContainer) {
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/Heal.png",
            cols: 6,
            rows: 4,
            cutOffFrames: 0
        },targetContainer + " .effect");
        $(targetContainer + " .effect").show();
        $(targetContainer + " .effect").css("transform", "scale(1.6)");
        sprite.play({
            run: 1,
            delay: 50 * SMBPlayback.iSpeed
        })
    }
    playResurrect(targetContainer) {
        var div = $("<div>", {
            style: "transform: scale(1.3) translateX(16px) translateY(-20px); z-index: 100; pointer-events: none;"
        });
        $(targetContainer).prepend(div);
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/resurrect.png",
            cols: 8,
            rows: 3
        },div[0]);
        sprite.play({
            run: 2,
            delay: 50 * SMBPlayback.iSpeed,
            onStop: ()=>{
                sprite.destroy()
            }
        })
    }
    playDebuff(targetContainer) {
        var div = $("<div>", {
            style: "transform: scale(2.1) translateX(11px) translateY(-9px); z-index: 100; pointer-events: none;"
        });
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/Debuff.png",
            cols: 4,
            rows: 4,
            cutOffFrames: 2
        },div[0]);
        $(targetContainer).prepend(div);
        anime({
            targets: targetContainer + " .card",
            filter: ["grayscale(.7)", "grayscale(0)"],
            easing: "easeInQuint",
            duration: 1200
        });
        sprite.play({
            run: 1,
            delay: 50 * SMBPlayback.iSpeed,
            onStop: ()=>{
                sprite.destroy()
            }
        })
    }
    playBuff(targetContainer) {
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/Buff.png",
            cols: 4,
            rows: 4,
            cutOffFrames: 2
        },targetContainer + " .effect");
        $(targetContainer + " .effect").show();
        $(targetContainer + " .effect").css("transform", "scale(2.1) translateX(11px) translateY(-9px)");
        anime({
            targets: targetContainer + " .card",
            filter: ["saturate(2.5)", "saturate(1)"],
            easing: "easeInQuint",
            duration: 1200
        });
        sprite.play({
            run: 1,
            delay: 50 * SMBPlayback.iSpeed
        })
    }
    playThorns(targetContainer) {
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/thorns.png",
            cols: 4,
            rows: 5
        },targetContainer + " .effect");
        $(targetContainer + " .effect").show();
        $(targetContainer + " .effect").css("transform", "scale(1.5) translateX(-12px) translateY(-16.2px)");
        sprite.play({
            run: 1,
            delay: 50 * SMBPlayback.iSpeed,
            onStop: ()=>{
                $(targetContainer + " .effect").hide()
            }
        })
    }
    playStun(targetContainer) {
        var div = $("<div>", {
            style: "transform: scale(1.2) translateX(7px) translateY(.8px); z-index: 100; pointer-events: none;"
        });
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/stun.png",
            cols: 6,
            rows: 4
        },div[0]);
        setTimeout(()=>{
            $(targetContainer).prepend(div);
            sprite.play({
                run: 1,
                delay: 50 * SMBPlayback.iSpeed,
                onStop: ()=>{
                    sprite.destroy()
                }
            })
        }
        , 600 * SMBPlayback.iSpeed)
    }
    playPoison(targetContainer) {
        var div = $("<div>", {
            style: "transform: scale(1.2) translateX(10px) translateY(-7.2px); z-index: 100; pointer-events: none;"
        });
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/poison.png",
            cols: 5,
            rows: 4
        },div[0]);
        setTimeout(()=>{
            $(targetContainer).prepend(div);
            anime({
                targets: targetContainer + " .card",
                filter: ["hue-rotate(90deg)", "hue-rotate(0deg)"],
                easing: "easeInQuint",
                duration: 1200
            });
            sprite.play({
                run: 1,
                delay: 50 * SMBPlayback.iSpeed,
                onStop: ()=>{
                    sprite.destroy()
                }
            })
        }
        , 600 * SMBPlayback.iSpeed)
    }
    playEnrage(targetContainer) {
        var div = $("<div>", {
            style: "transform: scale(1.2) translateX(10px) translateY(-7.2px); z-index: 100; pointer-events: none;"
        });
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/enrage.png",
            cols: 5,
            rows: 4
        },div[0]);
        setTimeout(()=>{
            $(targetContainer).prepend(div);
            sprite.play({
                run: 1,
                delay: 50 * SMBPlayback.iSpeed,
                onStop: ()=>{
                    sprite.destroy()
                }
            })
        }
        , 600 * SMBPlayback.iSpeed)
    }
    playBlast(targetContainer) {
        let sprite = new Spriteling({
            url: SM.settings.battles.asset_url + "effects/blast.png",
            cols: 4,
            rows: 4
        },targetContainer + " .effect");
        $(targetContainer + " .effect").show();
        $(targetContainer + " .effect").css("transform", "scale(1.5) translateX(8px) translateY(6px)");
        sprite.play({
            run: 1,
            delay: 45 * SMBPlayback.iSpeed,
            onStop: ()=>{
                $(targetContainer + " .effect").hide()
            }
        })
    }
    static FlashTarget(target, time) {
        $(target).addClass("flash");
        setTimeout(()=>{
            $(target).removeClass("flash")
        }
        , time * SMBPlayback.iSpeed)
    }
}
var portrait_loader = new PIXI.Loader;
class SMBPortrait {
    constructor(targetContainer, teamInfo, playerInfo, tooltipPlacement, ruleset) {
        let divContainer = $(targetContainer);
        this.portrait = new PIXI.Application({
            width: 252,
            height: 170
        });
        divContainer.append(this.portrait.view);
        divContainer.attr("team", teamInfo.player);
        $(`${targetContainer} .bio__avatar`).append(SM.ShowComponent("avatar", playerInfo));
        $(`${targetContainer} .bio__name__pre`).text(playerInfo.title_pre || "");
        $(`${targetContainer} .bio__name__display`).text(playerInfo.display_name || playerInfo.name);
        $(`${targetContainer} .bio__name__post`).text(playerInfo.title_post || "");
        $(`${targetContainer} .bio__guild .aspect-ratio__content`).append(SM.ShowComponent("guilds/crest", {
            guild_data: playerInfo.guild_data
        }));
        $(`${targetContainer} .bio__guild__name`).text(playerInfo.guild_name || SM.Translator.t("guild.misc.no_guild", {
            _: "No Guild"
        }));
        let summoner = SM.GetCardDetails(teamInfo.summoner.card_detail_id);
        let summoner_stats = SM.GetCardStats(teamInfo.summoner);
        if (summoner_stats.attack != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.attack > 0 ? SM.Translator.t("components.stats.attack_plus", {
                _: `All friendly Melee Attack Monsters have +%{attack} Melee Attack`,
                attack: summoner_stats.attack
            }) : SM.Translator.t("components.stats.attack_less", {
                _: `All enemy Melee Attack Monsters have %{attack} Melee Attack`,
                attack: summoner_stats.attack
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/melee-attack.png">\n\t\t\t\t<div class="stat-text">\n\t\t\t\t\t${(summoner_stats.attack > 0 ? "+" : "") + summoner_stats.attack}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        if (summoner_stats.ranged != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.ranged > 0 ? SM.Translator.t("components.stats.ranged_plus", {
                _: `All friendly Ranged Attack Monsters have +%{ranged} Ranged Attack`,
                ranged: summoner_stats.ranged
            }) : SM.Translator.t("components.stats.ranged_less", {
                _: `All enemy Ranged Attack Monsters have %{ranged} Ranged Attack`,
                ranged: summoner_stats.ranged
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/ranged-attack.png">\n\t\t\t\t<div class="stat-text">\n\t\t\t\t\t${(summoner_stats.ranged > 0 ? "+" : "") + summoner_stats.ranged}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        if (summoner_stats.magic != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.magic > 0 ? SM.Translator.t("components.stats.magic_plus", {
                _: `All friendly Magic Attack Monsters have +%{magic} Magic Attack`,
                magic: summoner_stats.magic
            }) : SM.Translator.t("components.stats.magic_less", {
                _: `All enemy Magic Attack Monsters have %{magic} Magic Attack`,
                magic: summoner_stats.magic
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/magic-attack.png">\n\t\t\t\t<div class="stat-text">\n\t\t\t\t\t${(summoner_stats.magic > 0 ? "+" : "") + summoner_stats.magic}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        if (summoner_stats.speed != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.speed > 0 ? SM.Translator.t("components.stats.speed_plus", {
                _: `All friendly Monsters have +%{speed} Speed`,
                speed: summoner_stats.speed
            }) : SM.Translator.t("components.stats.speed_less", {
                _: `All enemy Monsters have %{speed} Speed`,
                speed: summoner_stats.speed
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/speed.png">\n\t\t\t\t<div class="stat-text speed">\n\t\t\t\t\t${(summoner_stats.speed > 0 ? "+" : "") + summoner_stats.speed}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        if (summoner_stats.armor != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.armor > 0 ? SM.Translator.t("components.stats.armor_plus", {
                _: `All friendly Monsters have +%{armor} Armor`,
                armor: summoner_stats.armor
            }) : SM.Translator.t("components.stats.armor_less", {
                _: `All enemy Monsters have %{armor} Armor`,
                armor: summoner_stats.armor
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/defense.png">\n\t\t\t\t<div class="stat-text">\n\t\t\t\t\t${(summoner_stats.armor > 0 ? "+" : "") + summoner_stats.armor}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        if (summoner_stats.health != 0) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t<div class="battle-zoomable-obj" style="margin-bottom: 6px;" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${summoner_stats.health > 0 ? SM.Translator.t("components.stats.health_plus", {
                _: `All friendly Monsters have +%{health} Health`,
                health: summoner_stats.health
            }) : SM.Translator.t("components.stats.health_less", {
                _: `All enemy Monsters have %{health} Health`,
                health: summoner_stats.health
            })}">\n\t\t\t\t<img src="https://d36mxiodymuqjm.cloudfront.net/website/stats/health.png">\n\t\t\t\t<div class="stat-text">\n\t\t\t\t\t${(summoner_stats.health > 0 ? "+" : "") + summoner_stats.health}\n\t\t\t\t</div>\n\t\t\t</div>`)
        }
        for (let i = 0; i < summoner_stats.abilities.length; i++) {
            $(`${targetContainer} .stats`).append(`\n\t\t\t\t<img style="margin-bottom: 6px;" src="https://d36mxiodymuqjm.cloudfront.net/website/abilities/summoner/ability_${summoner_stats.abilities[i].toLowerCase().replace(" ", "-")}.png"\n\t\t\t\tclass="battle-zoomable-obj" data-toggle="tooltip" data-placement="${tooltipPlacement}" data-container="body"\n\t\t\t\tdata-template='<div class="tooltip" role="tooltip"><div class="tooltip-inner modern" style="min-width: 180px; max-width: 180px;"></div></div>'\n\t\t\t\ttitle="${SM.Translator.t("global.summoner_abilities." + summoner_stats.abilities[i].toLowerCase().replace(" ", "_"), {
                _: summoner_stats.abilities[i]
            })}" ability="${summoner_stats.abilities[i]}" />`)
        }
        if (ruleset.split("|").includes("Silenced Summoners")) {
            $(`${targetContainer} .stats .battle-zoomable-obj`).addClass("disabled");
            $(`${targetContainer} .stats .battle-zoomable-obj`).attr("title", SM.Translator.t("battle.silenced_tooltip", {
                _: `Summoner abilities disabled for this ruleset.`
            }))
        }
        portrait_loader.add(targetContainer, "https://d36mxiodymuqjm.cloudfront.net/website/battle/portraits_v2/" + (teamInfo.summoner.skin ? teamInfo.summoner.skin + "/" : "") + summoner.name + ".png");
        portrait_loader.add(targetContainer + "_background", Config.asset_location + "scripts/battle/portrait.shader");
        this.container = new PIXI.Container;
        this.container.filterArea = this.portrait.screen;
        this.portrait.stage.addChild(this.container);
        this.sprite = null;
        this.filter = null;
        portrait_loader.onComplete.add((loader,resources)=>{
            this.sprite = new PIXI.Sprite(portrait_loader.resources[targetContainer].texture);
            this.portrait.stage.addChild(this.sprite);
            let uniforms = {
                dimensions: [this.portrait.screen.width, this.portrait.screen.height],
                time: 0
            };
            switch (teamInfo.color.toLowerCase()) {
            case "black":
                uniforms.finalColorMulti = [1, 0, 1];
                break;
            case "blue":
                uniforms.finalColorMulti = [0, 0, 1];
                break;
            case "red":
                uniforms.finalColorMulti = [1, 0, 0];
                break;
            case "green":
                uniforms.finalColorMulti = [0, 1, 0];
                break;
            case "gold":
                uniforms.finalColorMulti = [1, 1, 0];
                break;
            case "white":
                uniforms.finalColorMulti = [1, 1, 1];
                break
            }
            this.filter = new PIXI.Filter(null,portrait_loader.resources[targetContainer + "_background"].data,uniforms);
            this.container.filters = [this.filter];
            this.portrait.ticker.add(delta=>{
                var v2 = this.filter.uniforms.dimensions;
                v2[0] = this.portrait.screen.width;
                v2[1] = this.portrait.screen.height;
                this.filter.uniforms.dimensions = v2;
                this.filter.uniforms.time += .1
            }
            )
        }
        );
        var color = teamInfo.color == "Black" ? "purple" : teamInfo.color == "White" ? "#BBB" : teamInfo.color == "Gold" ? "goldenrod" : teamInfo.color;
        $(divContainer.children()[2]).css("box-shadow", "0 0 5px 1px " + color);
        $(divContainer.children()[2]).css("border", "2px solid " + color);
        $(divContainer.children()[2]).attr("uid", teamInfo.summoner.uid);
        $(divContainer.children()[2]).attr("id", teamInfo.summoner.uid)
    }
    CleanUp() {
        if (this.sprite)
            this.sprite.destroy();
        if (this.container)
            this.container.destroy();
        if (this.portrait && this.portrait.stage) {
            this.portrait.stage.destroy()
        }
        if (this.portrait) {
            this.portrait.destroy(true, {
                children: true,
                texture: true,
                baseTexture: true
            });
            this.portrait.stage = null
        }
        portrait_loader = new PIXI.Loader;
        this.portrait = null;
        this.container = null;
        this.sprite = null;
        this.filter = null
    }
    static LoadPortraits() {
        portrait_loader.load()
    }
}
class SMBSounds {
    static MagicHit() {
        if (this.snd_magicHit == null) {
            this.snd_magicHit = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Magic_Hit.mp3"]
            });
            this.snd_magicHit.once("load", function() {
                SMBSounds.MagicHit()
            })
        }
        this.snd_magicHit.play()
    }
    static MeleeHit() {
        if (this.snd_meleeHit == null) {
            this.snd_meleeHit = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Melee_Hit.mp3"]
            });
            this.snd_meleeHit.once("load", function() {
                SMBSounds.MeleeHit()
            })
        }
        this.snd_meleeHit.stop().seek(1).play()
    }
    static MeleeMiss() {
        if (this.snd_meleeMiss == null) {
            this.snd_meleeMiss = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Melee_Miss.mp3"]
            });
            this.snd_meleeMiss.once("load", function() {
                SMBSounds.MeleeMiss()
            })
        }
        this.snd_meleeMiss.stop().seek(1).play()
    }
    static RangedHit() {
        if (this.snd_rangedHit == null) {
            this.snd_rangedHit = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Ranged_Hit.mp3"]
            });
            this.snd_rangedHit.once("load", function() {
                SMBSounds.RangedHit()
            })
        }
        this.snd_rangedHit.stop().seek(1).play()
    }
    static RangedMiss() {
        if (this.snd_rangedMiss == null) {
            this.snd_rangedMiss = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Ranged_Miss.mp3"]
            });
            this.snd_rangedMiss.once("load", function() {
                SMBSounds.RangedMiss()
            })
        }
        this.snd_rangedMiss.stop().seek(1).play()
    }
    static BattleStart() {
        if (this.snd_battleStart == null) {
            this.snd_battleStart = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Stinger_BattleStart.mp3"]
            });
            this.snd_battleStart.once("load", function() {
                SMBSounds.BattleStart()
            })
        }
        this.snd_battleStart.play()
    }
    static NextRound() {
        if (this.snd_nextRound == null) {
            this.snd_nextRound = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Stinger_NextRound.mp3"]
            });
            this.snd_nextRound.once("load", function() {
                SMBSounds.NextRound()
            })
        }
        this.snd_nextRound.play()
    }
    static SummonMonster() {
        if (this.snd_summon == null) {
            this.snd_summon = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Monster_Dispatch.mp3"]
            });
            this.snd_summon.once("load", function() {
                SMBSounds.SummonMonster()
            })
        }
        this.snd_summon.play()
    }
    static MonsterKO() {
        if (this.snd_monsterKO == null) {
            this.snd_monsterKO = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Monster_KO.mp3"]
            });
            this.snd_monsterKO.once("load", function() {
                SMBSounds.MonsterKO()
            })
        }
        this.snd_monsterKO.play()
    }
    static FightOverInterlude() {
        if (this.snd_fightOver == null) {
            this.snd_fightOver = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Stinger_BattleOver_Victory.mp3"]
            });
            this.snd_fightOver.once("load", function() {
                SMBSounds.FightOverInterlude()
            })
        }
        this.snd_fightOver.play()
    }
    static PlayMainBattleTheme() {
        if (this.snd_mainBattleTheme == null) {
            let songs = ["BurningLands", "CallOfWar", "FlightoftheElementalPhoenix", "ForestAwoken", "JournalofZintarMortalis", "SummonersStrife"];
            this.snd_mainBattleTheme = new Howl({
                src: [`https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/MusicLoop_${songs[Math.floor(Math.random() * songs.length)]}.mp3`],
                volume: .8
            });
            this.snd_mainBattleTheme.once("load", function() {
                SMBSounds.PlayMainBattleTheme()
            })
        } else
            this.snd_mainBattleTheme.stop().loop(true).play()
    }
    static StopMainBattleTheme() {
        if (this.snd_mainBattleTheme != null) {
            this.snd_mainBattleTheme.unload();
            this.snd_mainBattleTheme = null
        }
    }
    static Heal() {
        if (this.snd_heal == null) {
            this.snd_heal = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Heal.mp3"]
            });
            this.snd_heal.once("load", function() {
                SMBSounds.Heal()
            })
        }
        this.snd_heal.play()
    }
    static Resurrect() {
        if (this.snd_resurrect == null) {
            this.snd_resurrect = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Resurrect.mp3"]
            });
            this.snd_resurrect.once("load", function() {
                SMBSounds.Resurrect()
            })
        }
        if (this.snd_mainBattleTheme != null) {
            this.snd_mainBattleTheme.fade(.8, .1, 1e3);
            setTimeout(()=>{
                this.snd_mainBattleTheme.fade(.2, .8, 1e3)
            }
            , 3500)
        }
        this.snd_resurrect.play()
    }
    static Buff() {
        if (this.snd_buff == null) {
            this.snd_buff = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Buff.mp3"]
            });
            this.snd_buff.once("load", function() {
                SMBSounds.Buff()
            })
        }
        if (!this.snd_buff.playing())
            this.snd_buff.play()
    }
    static Debuff() {
        if (this.snd_debuff == null) {
            this.snd_debuff = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Debuff.mp3"]
            });
            this.snd_debuff.once("load", function() {
                SMBSounds.Debuff()
            })
        }
        if (!this.snd_debuff.playing())
            this.snd_debuff.play()
    }
    static Thorns() {
        if (this.snd_thorns == null) {
            this.snd_thorns = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Thorns.mp3"]
            });
            this.snd_thorns.once("load", function() {
                SMBSounds.Thorns()
            })
        }
        if (!this.snd_thorns.playing())
            this.snd_thorns.play()
    }
    static Hit4() {
        if (this.snd_hit4 == null) {
            this.snd_hit4 = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Hit4.mp3"]
            });
            this.snd_hit4.once("load", function() {
                SMBSounds.Hit4()
            })
        }
        if (!this.snd_hit4.playing())
            this.snd_hit4.play()
    }
    static Enrage() {
        if (this.snd_enrage == null) {
            this.snd_enrage = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Enrage.mp3"]
            });
            this.snd_enrage.once("load", function() {
                SMBSounds.Enrage()
            })
        }
        setTimeout(()=>{
            if (!this.snd_enrage.playing())
                this.snd_enrage.play()
        }
        , 800)
    }
    static Poison() {
        if (this.snd_poison == null) {
            this.snd_poison = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Poison.mp3"]
            });
            this.snd_poison.once("load", function() {
                SMBSounds.Poison()
            })
        }
        setTimeout(()=>{
            if (!this.snd_poison.playing())
                this.snd_poison.play()
        }
        , 800)
    }
    static Stun() {
        if (this.snd_stun == null) {
            this.snd_stun = new Howl({
                src: ["https://d36mxiodymuqjm.cloudfront.net/website/battle/sfx/Battle_Stun.mp3"]
            });
            this.snd_stun.once("load", function() {
                SMBSounds.Stun()
            })
        }
        setTimeout(()=>{
            if (!this.snd_stun.playing())
                this.snd_stun.play()
        }
        , 800)
    }
}
class SMiscSounds {
    static PlayGuildBuildingTheme(building_name) {
        if (this.snd_guildBldgTheme == null) {
            this.snd_guildBldgTheme = new Howl({
                src: [`https://d36mxiodymuqjm.cloudfront.net/website/guilds/bldg/audio/bg_${building_name}_audio.mp3`],
                volume: 1
            });
            this.snd_guildBldgTheme.once("load", function() {
                SMiscSounds.PlayGuildBuildingTheme(building_name)
            })
        } else {
            this.snd_guildBldgTheme.stop().loop(true).play()
        }
    }
    static StopGuildBuildingTheme() {
        if (this.snd_guildBldgTheme != null) {
            this.snd_guildBldgTheme.unload();
            this.snd_guildBldgTheme = null
        }
    }
}
