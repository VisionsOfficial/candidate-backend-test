import { participant } from '../schemas/schemas';

const participantsArray = [
    { fullname: 'participantA' },
    { fullname: 'participantB' },
];

export default async function () {
    const [nameA, nameB] = participantsArray.map((p) => p.fullname);
    const rg = new RegExp(`${nameA}|${nameB}`);
    await participant.deleteMany({ fullname: rg });
    for (const p of participantsArray) {
        const prt = new participant({ fullname: p.fullname });
        await prt.save();
    }
    // console.log(
    //     (await participant.find()).map((p) => ({
    //         id: p._id.toString(),
    //         fullname: p.fullname,
    //     }))
    // );
    console.log(await participant.find().populate('contracts'));
}
