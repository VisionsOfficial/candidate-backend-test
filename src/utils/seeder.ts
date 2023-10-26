import { Participant } from '../schemas/schemas';

// for the sake of simplicity here is 2 participant with their ids and fullnames
// they are seeded on service start and console.logs show their datas
const participantsArray = [
    { id: '653a5c5670634b213c412d78', fullname: 'participantA' },
    { id: '653a5c5670634b213c412d7a', fullname: 'participantB' },
];

export default async function () {
    // cleaning participant A and B
    const [nameA, nameB] = participantsArray.map((p) => p.fullname);
    const rg = new RegExp(`${nameA}|${nameB}`);
    await Participant.deleteMany({ fullname: rg });

    // creating new ones
    for (const p of participantsArray) {
        const prt = new Participant({ _id: p.id, fullname: p.fullname });
        await prt.save();
    }
    // console.log(
    //     (await Participant.find()).map((p) => ({
    //         id: p._id.toString(),
    //         fullname: p.fullname,
    //     }))
    // );
}
