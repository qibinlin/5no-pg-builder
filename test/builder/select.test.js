const chai = require('chai')

const Manager = require('../../compiled')

const expect = chai.expect

describe('Builder', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('Select', () => {
    it('without where, order, limit', async () => {

        const SelectQuery = Manager.build({
            table: "users"
        }).select(["*"])
        .query()

        expect(SelectQuery.query).to.eql('SELECT users.* FROM public.users AS users')
    })
    
    it('with alias', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers"
        }).select(["*"])
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.* FROM public.users AS Testusers')
    })

    it('with alias and custom schema', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["*"])
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.* FROM custom.users AS Testusers')
    })
    
    it('with custom fields', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers')
    })
    
    it('with functions', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["sum(email) AS sum_emails"])
        .query()

        expect(SelectQuery.query).to.eql('SELECT sum(Testusers.email) AS sum_emails FROM custom.users AS Testusers')
    })
    
    it('with some where', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .where('email', '=', 'test')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.email = $1')
        expect(SelectQuery.vars).to.eql([ 'test' ])
    })
    
    it('with some whereIn', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .whereIn('email', ['test', 'test1'])
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.email IN ($1,$2)')
        expect(SelectQuery.vars).to.eql([ 'test', 'test1' ])
    })

    it('with some whereOr', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .whereOr('email', '=', 'test')
        .whereOr('email', '=', 'test1')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.email = $1 OR Testusers.email = $2')
        expect(SelectQuery.vars).to.eql([ 'test', 'test1' ])
    })

    it('with couple of whereOr', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .whereOr('email', '=', 'test', 'email')
        .whereOr('email', '=', 'test1', 'email')
        .whereOr('last_name', '=', 'last_name1', 'last_name')
        .whereOr('last_name', '=', 'last_name2', 'last_name')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE (Testusers.email = $1 OR Testusers.email = $2) AND (Testusers.last_name = $3 OR Testusers.last_name = $4)')
        expect(SelectQuery.vars).to.eql([ 
            "test",
            "test1",
            "last_name1",
            "last_name2"
        ])
    })

    it('with compilation where', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .where('first_name', '=', 'first_name_test')
        .whereIn('last_name', ['last_name1', 'last_name2'])
        .whereOr('email', '=', 'test')
        .whereOr('email', '=', 'test1')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.first_name = $1 AND Testusers.last_name IN ($2,$3) AND (Testusers.email = $4 OR Testusers.email = $5)')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "last_name1",
            "last_name2",
            "test",
            "test1"
            ])
    })

    it('with order', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .order('email', 'ASC')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers ORDER BY Testusers.email ASC')
    })

    it('with couple of orders', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .order('email', 'ASC')
        .order('first_name', 'DESC')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers ORDER BY Testusers.email ASC, Testusers.first_name DESC')
    })
    
    it('with couple of orders and where', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .where('first_name', '=', 'first_name_test')
        .whereIn('last_name', ['last_name1', 'last_name2'])
        .whereOr('email', '=', 'test')
        .whereOr('email', '=', 'test1')
        .order('email', 'ASC')
        .order('first_name', 'DESC')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.first_name = $1 AND Testusers.last_name IN ($2,$3) AND (Testusers.email = $4 OR Testusers.email = $5) ORDER BY Testusers.email ASC, Testusers.first_name DESC')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "last_name1",
            "last_name2",
            "test",
            "test1"
            ])
    })

    it('with limit', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .limit(10)
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers LIMIT 10')
    })

    it('with limit, offset', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .limit(10, 5)
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers LIMIT 10 OFFSET 5')
    })

    it('with limit, offset and orders', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .limit(10, 5)
        .order('email', 'ASC')
        .order('first_name', 'DESC')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers ORDER BY Testusers.email ASC, Testusers.first_name DESC LIMIT 10 OFFSET 5')
    })

    it('with couple of orders and where and limit', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .where('first_name', '=', 'first_name_test')
        .whereIn('last_name', ['last_name1', 'last_name2'])
        .whereOr('email', '=', 'test')
        .whereOr('email', '=', 'test1')
        .order('email', 'ASC')
        .order('first_name', 'DESC')
        .limit(10, 5)
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.first_name = $1 AND Testusers.last_name IN ($2,$3) AND (Testusers.email = $4 OR Testusers.email = $5) ORDER BY Testusers.email ASC, Testusers.first_name DESC LIMIT 10 OFFSET 5')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "last_name1",
            "last_name2",
            "test",
            "test1"
            ])
    })

    it('with couple of orders and where and limit and distinct', async () => {

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .distinct()
        .where('first_name', '=', 'first_name_test')
        .whereIn('last_name', ['last_name1', 'last_name2'])
        .whereOr('email', '=', 'test')
        .whereOr('email', '=', 'test1')
        .order('email', 'ASC')
        .order('first_name', 'DESC')
        .limit(10, 5)
        .query()

        expect(SelectQuery.query).to.eql('SELECT DISTINCT Testusers.email, Testusers.first_name, Testusers.last_name AS FN FROM custom.users AS Testusers WHERE Testusers.first_name = $1 AND Testusers.last_name IN ($2,$3) AND (Testusers.email = $4 OR Testusers.email = $5) ORDER BY Testusers.email ASC, Testusers.first_name DESC LIMIT 10 OFFSET 5')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "last_name1",
            "last_name2",
            "test",
            "test1"
            ])
    })

    it('with left join', async () => {

        const SelectQueryInfo = Manager.build({
            table: "users_info",
            schema: "custom"
        }).select(["*"])

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .leftJoin(SelectQueryInfo, 'id', 'users_id')
        .where('first_name', '=', 'first_name_test')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN, users_info.* FROM custom.users AS Testusers LEFT JOIN custom.users_info AS users_info ON Testusers.id = users_info.users_id WHERE Testusers.first_name = $1')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            ])
    })
    
    it('with right join', async () => {

        const SelectQueryInfo = Manager.build({
            table: "users_info",
            schema: "custom"
        }).select(["*"])

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .rightJoin(SelectQueryInfo, 'id', 'users_id')
        .where('first_name', '=', 'first_name_test')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN, users_info.* FROM custom.users AS Testusers RIGHT JOIN custom.users_info AS users_info ON Testusers.id = users_info.users_id WHERE Testusers.first_name = $1')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            ])
    })
   
    it('with inner join', async () => {

        const SelectQueryInfo = Manager.build({
            table: "users_info",
            schema: "custom"
        }).select(["*"])

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .innerJoin(SelectQueryInfo, 'id', 'users_id')
        .where('first_name', '=', 'first_name_test')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN, users_info.* FROM custom.users AS Testusers INNER JOIN custom.users_info AS users_info ON Testusers.id = users_info.users_id WHERE Testusers.first_name = $1')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            ])
    })
   
    it('with inner join and where and order', async () => {

        const SelectQueryInfo = Manager.build({
            table: "users_info",
            schema: "custom"
        }).select(["*"]).where('status', '=', 't').order('created_at', 'DESC')

        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email", "first_name", "last_name AS FN"])
        .innerJoin(SelectQueryInfo, 'id', 'users_id')
        .where('first_name', '=', 'first_name_test')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email, Testusers.first_name, Testusers.last_name AS FN, users_info.* FROM custom.users AS Testusers INNER JOIN custom.users_info AS users_info ON Testusers.id = users_info.users_id WHERE Testusers.first_name = $1 AND users_info.status = $2 ORDER BY users_info.created_at DESC')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "t"
            ])
    })
   
    it('with where and group', async () => {
        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email"])
        .where('first_name', '=', 'first_name_test')
        .group(['email'])
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email FROM custom.users AS Testusers WHERE Testusers.first_name = $1 GROUP BY Testusers.email')
        expect(SelectQuery.vars).to.eql([
            "first_name_test"
            ])
    })
   
    it('with where and group and order', async () => {
        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email"])
        .where('first_name', '=', 'first_name_test')
        .group(['email'])
        .order('email', 'ASC')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email FROM custom.users AS Testusers WHERE Testusers.first_name = $1 GROUP BY Testusers.email ORDER BY Testusers.email ASC')
        expect(SelectQuery.vars).to.eql([
            "first_name_test"
            ])
    })
   
    it('with where and group and order and having', async () => {
        const SelectQuery = Manager.build({
            table: "users",
            alias: "Testusers",
            schema: "custom"
        }).select(["email"])
        .where('first_name', '=', 'first_name_test')
        .group(['email'])
        .order('email', 'ASC')
        .having('count(email)', '>', '1')
        .query()

        expect(SelectQuery.query).to.eql('SELECT Testusers.email FROM custom.users AS Testusers WHERE Testusers.first_name = $1 GROUP BY Testusers.email HAVING count(Testusers.email) > $2 ORDER BY Testusers.email ASC')
        expect(SelectQuery.vars).to.eql([
            "first_name_test",
            "1"
            ])
    })
  })
})
