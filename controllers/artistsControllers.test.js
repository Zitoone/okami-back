const {createOrUpdateArtist, createNewArtist, getAllArtists, getArtistById} = require ('./artistsController')

const Artist = require('../models/artistsModel')

jest.mock('../models/artistsModel')

describe('Artists Controllers', ()=>{
    let req, res
    beforeEach(()=>{
        req={params: {}, body: {} }
        res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })
    afterEach(()=>{
        jest.clearAllMocks()
    })

    describe('createNewArtist', ()=>{
        it('Should create a new artist in database', async()=>{
            const artistData= ({personalInfo:{
                                    lastName: 'Name 1',
                                    firstName: 'First Name 1',
                                    email: "one@email.com",
                                    phone: "01 48 54 27 61",
                                    projectName: "Artiste One"
                                    }
                                })
            const mockArtist={_id: "1", ...artistData}
            req.body=artistData

            const mockSave=jest.fn().mockResolvedValue(mockArtist)
            Artist.mockImplementation(()=>({save: mockSave}))

            await createNewArtist(req,res)
            expect(Artist).toHaveBeenCalledWith(expect.objectContaining(artistData))
            //objectContaining : Le test réussit si l’objet reçu contient au moins les propriétés de l’objet attendu (même si d’autres infos supplémentaires sont présentes)
            expect(mockSave).toHaveBeenCalledWith
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(mockArtist)
        }) // /it
    }) // /createNewArtist
    describe('getAllArtists', ()=>{    
        it('Should return all artists', async()=>{
            const mockArtists=[{
                _id: 1,
                lastName: 'Name 1',
                firstName: 'First Name 1',
                email: "one@email.com",
                phone: "01 48 54 27 61",
                projectName: "Artiste One"
            },{
                _id: 2,
                lastName: 'Name 2',
                firstName: 'First Name 2',
                email: "two@email.com",
                phone: "06 34 65 87 13",
                projectName: "Artiste Two"
            }]
            Artist.find.mockResolvedValue(mockArtists)
            await getAllArtists(req,res)
            expect(Artist.find).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalledWith(mockArtists)
        })
        it('Should handle erros', async()=>{
            Artist.find.mockRejectedValue(new Error('Database error'))
            await getAllArtists(req,res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({message: 'Database error'})
        }) // /it
    }) // /getAllArtists
    describe('getArtistById', ()=>{
        it("Should return an artist when found by ID", async()=>{
            const mockArtist={_id: 1,
                lastName: 'Name 1',
                firstName: 'First Name 1',
                email: "one@email.com",
                phone: "01 48 54 27 61",
                projectName: "Artiste One" 
            }
            req.params.id="1"
            Artist.findById.mockResolvedValue(mockArtist)
            await getArtistById(req,res)
            expect(Artist.findById).toHaveBeenCalledWith("1")
            expect(res.json).toHaveBeenCalledWith(mockArtist)
        }) // /it
        it("Should return 404 error when product not found", async()=>{
            req.params.id="1"
            Artist.findById.mockResolvedValue(null)
            await getArtistById(req,res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({message: 'Artiste non trouvé'})
        }) // /it
        it("Should Handle errors", async()=>{
            req.params.id="1"
            Artist.findById.mockRejectedValue(new Error("Database error"))
            await getArtistById(req,res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({message:"Database error"})
        }) // /it
    }) // /getArtistById
 /*    describe("createOrUpdateArtist", ()=>{
        it("Should update an artist if exist", async()=>{
            const mockArtist={_id: 1,
                personalInfo:{
                    lastName: 'Old name',
                    firstName: 'Old First',
                    email: "old@email.com",
                    phone: "01 00 00 00 00",
                    projectName: "Artiste One"
                },
                save: jest.fn().mockResolvedValue(true)
            }
            req.body={
                lastName: 'Name 1',
                firstName: 'First Name 1',
                email: "one@email.com",
                phone: "01 48 54 27 61",
                projectName: "Artiste One" ,
                invitName: "Tartanpion"
            }
            Artist.findById.mockResolvedValue(mockArtist)
            await createOrUpdateArtist(req,res)
            expect(Artist.findOne).toHaveBeenCalledWith({"personalInfo.projectName":"Artiste One"})
            expect(mockArtist.personalInfo.lastName).toBe('Name 1')
            expect(mockArtist.personalInfo.firstName).toBe('First Name 1')
            expect(mockArtist.personalInfo.email).toBe("one@email.com")
            expect(mockArtist.personalInfo.phone).toBe("01 48 54 27 61")
            expect(mockArtist.personalInfo.projectName).toBe("Artiste One")
            expect(mockArtist.personalInfo.invitName).toBe("Tartanpion")
            expect(mockArtist.save).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalledWith({message:"Artiste mis à jour", artist: mockArtist})
        }) // /It


    }) // /createOrUpdateArtist */
})