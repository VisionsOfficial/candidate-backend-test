import { Contract } from './models/contract';
import { User } from './models/users';
import Logger from './logger';

export const SeedDb = async () => {

    try {
        const seedContractData =
            {
                "_id": "653ada47b6de3307df0f560b",
                "createdAt": "2023-10-26T21:29:43.000Z",
                "dataConsumer": "653ab2966484ef549fa00700",
                "dataConsumerSignature": false,
                "dataProvider": "653a4f1d421a5f6dfe69c2b1",
                "dataProviderSignature": false,
                "status": "PENDING",
                "target": "http://company.com/dataset/1",
                "termsAndConditions": [
                    {
                        "@context": "https://www.w3.org/ns/odrl.jsonld",
                        "@type": "Offer",
                        "permission": {
                            "action": "use",
                            "target": "http://provider/service",
                            "constraint": [
                                {
                                    "leftOperand": "dateTime",
                                    "operator": "lt",
                                    "rightOperand": {
                                        "@value": "2023-12-31T23:59:59Z",
                                        "@type": "xsd:dateTime"
                                    }
                                },
                                {
                                    "leftOperand": "dateTime",
                                    "operator": "gt",
                                    "rightOperand": {
                                        "@value": "2023-01-01T00:00:00Z",
                                        "@type": "xsd:dateTime"
                                    }
                                }
                            ]
                        }
                    }
                ]
            };

        const seedFirstUserData: any = {
            "_id": "653ab2966484ef549fa00700",
            "email": "felix@visionspol.eu",
            "password": "ad65e9f6cf91e24a085cca9053e30ebaa54fd213a8033f108c1538bff6ed7919"
        }

        const seedSecondUserData: any =  {
            "_id": "653a4f1d421a5f6dfe69c2b1",
            "email": "john@doe.fr",
            "password": "ad65e9f6cf91e24a085cca9053e30ebaa54fd213a8033f108c1538bff6ed7919"
        }

        await Contract.findOneAndUpdate(
            {_id: "653ada47b6de3307df0f560b"},
            {"$set": seedContractData},
            {
                upsert: true,
                new: true,
            }
        );

        await User.findOneAndUpdate(
            {_id: "653ab2966484ef549fa00700"},
            {"$set": seedFirstUserData},
            {
                upsert: true,
                new: true,
            }
        );

        await User.findOneAndUpdate(
            {_id: "653a4f1d421a5f6dfe69c2b1"},
            {"$set": seedSecondUserData},
            {
                upsert: true,
                new: true,
            }
        );

        Logger.info('Database seeded successfully.');
    } catch (err) {
        Logger.error(err)
    }
}
