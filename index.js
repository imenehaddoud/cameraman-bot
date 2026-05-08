const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const ENFORCED_CHANNEL_IDS = [
  "1448775108243226736"
];

const GRACE_PERIOD_MS = 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`✅ Cameraman connecté en tant que ${client.user.tag}`);
});

function hasCameraOn(voiceState) {
  if (!voiceState) return false;
  if (typeof voiceState.selfVideo === "boolean") {
    return voiceState.selfVideo;
  }
  const vs = voiceState.member?.voice;
  if (vs && typeof vs.selfVideo === "boolean") {
    return vs.selfVideo;
  }
  return false;
}

client.on("voiceStateUpdate", async (oldState, newState) => {
  const member = newState.member;
  if (!member) return;

  const before = oldState.channelId;
  const after = newState.channelId;

  if (!after) return;
  if (!ENFORCED_CHANNEL_IDS.includes(after)) return;

  const justJoined = before !== after || before === null;
  const justTurnedOffCam = !justJoined && oldState.selfVideo === true && newState.selfVideo === false;

  if (!justJoined && !justTurnedOffCam) return;

  if (justJoined) {
    console.log(`${member.user.tag} a rejoint le vocal. Vérification cam...`);
    setTimeout(async () => {
      const refreshed = await member.guild.members.fetch(member.id).catch(() => null);
      if (!refreshed) return;
      const state = refreshed.voice;
      if (!state || !state.channelId) return;
      if (!ENFORCED_CHANNEL_IDS.includes(state.channelId)) return;

      if (!hasCameraOn(state)) {
        console.log(`🚫 ${refreshed.user.tag} n'a pas activé sa cam → déconnexion.`);
        await state.setChannel(null).catch(() => null);
      } else {
        console.log(`✅ ${refreshed.user.tag} a activé sa caméra.`);
      }
    }, GRACE_PERIOD_MS);

  } else if (justTurnedOffCam) {
    console.log(`🚫 ${member.user.tag} a éteint sa cam → déconnexion.`);
    await newState.setChannel(null).catch(() => null);
  }
});

client.login(process.env.DISCORD_TOKEN);
