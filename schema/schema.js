const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, _) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(response => response.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, _) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => response.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(_, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(_, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(_, { firstName, age, companyId }) {
        return axios
          .post('http://localhost:3000/users', {
            firstName,
            age
          })
          .then(response => response.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then(response => response.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) },
          companyId: { type: GraphQLString }
        },
        resolve(_, args) {
          return axios
            .patch(`http://localhost:3000/users/${id}`, args)
            .then(response => response.data);
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
