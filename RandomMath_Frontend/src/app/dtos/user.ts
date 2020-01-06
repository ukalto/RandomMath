export class User {
    constructor(public userid: number,
        public username: string,
        public email: string,
        public password: string,
        public score: number,
        public playedGames: number,
        public scorePercentage: number) {
    }
}