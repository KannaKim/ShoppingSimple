
insert into users(username,email,passhash) values('testacc2','testingtesting@test.com',
	crypt('thisispassword',gen_salt('bf'))
)