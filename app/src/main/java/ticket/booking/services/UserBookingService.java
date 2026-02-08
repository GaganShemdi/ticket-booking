package ticket.booking.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ticket.booking.entities.User;
import ticket.booking.util.UserServiceUtil;

import javax.imageio.IIOException;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class UserBookingService {
    private User user;

    private List<User> userList;


    private static final String USERS_PATH = "app/src/main/java/ticket/booking/localDb/users.json";

    private  ObjectMapper objectMapper = new ObjectMapper();




    public UserBookingService(User user1) throws IOException {
        this.user = user1;
        File users = new File(USERS_PATH);
        userList = objectMapper.readValue(users, new TypeReference<List<User>>() {});

    }

    public UserBookingService() throws IOException{
        loadUsers();
    }

    public List<User> loadUsers() throws IOException{
        File users = new File(USERS_PATH);
        userList = objectMapper.readValue(users, new TypeReference<List<User>>() {});
    }



    public Boolean loginUser(){
        Optional<User> foundUser = userList.stream().filter(user1 -> {
            return user1.getName().equals(user.getName()) && UserServiceUtil.checkPassword(user.getPassword(), user1.getHashedPassword()); //lambda fucnton to check the username and poass,checks logged in  User:Gagan is valid
        }).findFirst();
        return foundUser.isPresent();  //findFirst will return me the first user , OPtional ( will not give me a NULL value ) , and the isPresent() will return me the ionly if any vaule is present
    }

    public Boolean signUp(User user1){
        try{
            userList.add(user1);
            saveUserListToFile(); //serialization Object----------->Json
            return Boolean.TRUE;
        }catch (IOException ex){
            return Boolean.FALSE;
        }
    }



    private void saveUserListToFile() throws IOException{
        File userFile = new File(USERS_PATH);
        objectMapper.writeValue(userFile,userList);
    }


    public void fetchBooking(){
        user.printTickets();
    }

}
