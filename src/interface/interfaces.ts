export interface Condition {
    context: string;
    type: string;
    permission: {
        action: string;
        target: string;
        constraint: [
            {
                leftOperand: string;
                operator: string;
                rightOperand: {
                    value: string;
                    type: string;
                };
            },
            {
                leftOperand: string;
                operator: string;
                rightOperand: {
                    value: string;
                    type: string;
                };
            }
        ];
    };
}
