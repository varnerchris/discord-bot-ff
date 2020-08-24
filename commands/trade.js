const fetch = require("node-fetch");
const axios = require('axios');
var moment = require('moment'); // require
const mflIds = require('../ids');
const year = mflIds.Ids.year;
const leagueID = mflIds.Ids.leagueID;
const leagueOwners = mflIds.Ids.leagueOwners;

const tradeBaitUrl = "http://www60.myfantasyleague.com/"+year+"/export?TYPE=tradeBait&L="+leagueID+"&APIKEY=&INCLUDE_DRAFT_PICKS=Y&JSON=1";
const playerProfilesUrl = "http://www60.myfantasyleague.com/"+year+"/export?TYPE=players&L="+leagueID+"&APIKEY=&DETAILS=&SINCE=&PLAYERS=:playerIds&JSON=1"

async function logFetch(url) {
  try {
    const response = await fetch(url);
    console.log(await response.text());
  }
  catch (err) {
    console.log('fetch failed', err);
  }
}

function findMentionedUser(input){
  return Array.from(input.mentions.users.values())[0]
}

function matchOwnersToMentions(mention , owners){
//console.log(mentions[0])
for(var key in leagueOwners){
  if(key === mention){
    return leagueOwners[key]
  }
}}

function filterData(data, user = 'none'){
  for (var key in data){
      if(data[key]['franchise_id'] === user){
      return data[key]
    }
  }
}

/**
 * @param { string } user
 * @return {{ willGiveUp:Array<object>, inExchangeFor:string }}
 */
const getData = async (user) => {
  //console.log(user)
  let tradeResponse = await axios.get(tradeBaitUrl) //trade response
  let tradeBaitData = tradeResponse.data.tradeBaits.tradeBait // all trades
  let tradePlayerObject = filterData(tradeBaitData, user) // all players wanted in a trade
  if(!tradePlayerObject){
    throw new Error('no trade player object');
  }
  let playerProfilesUrlFormatted = playerProfilesUrl.replace(':playerIds',tradePlayerObject.willGiveUp)
  let playerProfileResponse = await axios.get(playerProfilesUrlFormatted) //repsonse
  let willGiveUp = playerProfileResponse.data.players.player;

  return {
    willGiveUp: Array.isArray(willGiveUp)?willGiveUp:[willGiveUp], // array of player objects
    inExchangeFor: tradePlayerObject.inExchangeFor //a string of inExhangeFor
  }
}


module.exports = {
  name: '!trade',
  description: 'Trade!',
    async execute(msg, args) {
      let mentionedUser = findMentionedUser(msg);
      let matchOwners = matchOwnersToMentions(mentionedUser.id,leagueOwners);
      let response;
      try{
        let returnTrades = await getData(matchOwners)
        let playerNames = returnTrades.willGiveUp.map(playerObj =>{
            return playerObj.name
          }).join("\n")
        response =`${mentionedUser} is willing to trade: ${playerNames} and wants in return ${returnTrades.inExchangeFor} `
      }catch(err){
        response = 'No one available for trading'
      }

      msg.channel.send(response);
  },
};
