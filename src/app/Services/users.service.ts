// Holds all the data regarding the users

export class UsersService {
  users = [
    {
      name: "Anita",
      id: 1,
      imagePath: "../../assets/img/users_images/person1.jpg"
    },
    {
      name: "Hanna",
      id: 2,
      imagePath: "../../assets/img/users_images/person2.jpg"
    },
    {
      name: "Dénes",
      id: 3,
      imagePath: "../../assets/img/users_images/person3.jpg"
    },
    {
      name: "Károly",
      id: 4,
      imagePath: "../../assets/img/users_images/person4.jpg"
    },
    {
      name: "Tamás",
      id: 5,
      imagePath: "../../assets/img/users_images/person5.jpg"
    }
  ];
// return the copy of the original array
  getUsers() {
    return this.users.slice();
  }
}
