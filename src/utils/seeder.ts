import { Participant } from '../schemas/schemas';

// for the sake of simplicity here is 2 participant with their ids and names
// they are seeded on service start
const participantsArray = [
    { id: '653a5c5670634b213c412d76', name: 'participantA' },
    { id: '653a5c5670634b213c412d77', name: 'participantB' },
    { id: '653a5c5670634b213c412d78', name: 'participantC' },
];

export default async function () {
    // cleaning participant A and B
    const [nameA, nameB, nameC] = participantsArray.map((p) => p.name);
    const rg = new RegExp(`${nameA}|${nameB}|${nameC}`);
    await Participant.deleteMany({ name: rg });

    // creating new ones
    for (const p of participantsArray) {
        const prt = new Participant({ _id: p.id, name: p.name });
        await prt.save();
    }
}
