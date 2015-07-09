
# server
server<-function(input,output,session){
  output$plotHist<-renderPlot(hist(rnorm(input$sliderNum)))
  session$onSessionEnded(function() {
    print('session ended')
    #stopApp()
})

}

# ui
ui<-fluidPage(
  sliderInput('sliderNum','Choose',min=1,max=100,value=100),
  plotOutput('plotHist')
  )


shinyApp(ui = ui, server = server)
