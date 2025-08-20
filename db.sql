create table users(userid int auto_increment, fullname VARCHAR(100), 
email VARCHAR(100), password VARCHAR(255), primary key (userid));

create table posts(postid int auto_increment, content TEXT,
createdat DATETIME default CURRENT_TIMESTAMP(),postowner int,
primary key(postid), foreign key (postowner) references users(userid));

insert into users(fullname, email, password) 
values 
("albert kipchirchir", "albert@eldohub.co.ke","security"),
("kevin kibet", "kevin@eldohub.co.ke","password"),
("jane opiyo", "jane@eldohub.co.ke","protect");

show tables;
drop table posts;
select * from users;

