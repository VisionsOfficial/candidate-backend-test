import { Participant } from '../schemas/schemas';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
config();
const { SECRET } = process.env;

// for the sake of simplicity here is 3 participant with their ids, names
// and a token jwt, they are seeded on service start. Check the terminal logs to use it easily

const token = (participantName: string) =>
    sign({ name: participantName }, SECRET);
const participantsArray = [
    {
        id: '653a5c5670634b213c412d76',
        name: 'participantA',
        token: token('participantA'),
    },
    {
        id: '653a5c5670634b213c412d77',
        name: 'participantB',
        token: token('participantB'),
    },
    {
        id: '653a5c5670634b213c412d78',
        name: 'participantC',
        token: token('participantC'),
    },
];

export default async function () {
    // cleaning participant A and B
    const [nameA, nameB, nameC] = participantsArray.map((p) => p.name);
    const rg = new RegExp(`${nameA}|${nameB}|${nameC}`);
    await Participant.deleteMany({ name: rg });

    // creating new ones
    for (const p of participantsArray) {
        const prt = new Participant({
            _id: p.id,
            name: p.name,
            token: p.token,
        });
        await prt.save();
    }
    console.log(await Participant.find());
}
